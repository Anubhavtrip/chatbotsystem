const { WORKFLOW_NODE_TYPES } = require('../../constants');
const logger = require('../../utils/logger');

class WorkflowExecutor {
  constructor(workflow, context = {}) {
    this.workflow = workflow;
    this.context = {
      input: '',
      intent: null,
      memory: [],
      prompt: '',
      aiResponse: '',
      ...context,
    };
    this.nodeMap = new Map(workflow.nodes.map((n) => [n.id, n]));
  }

  getNode(id) {
    return this.nodeMap.get(id);
  }

  async executeNode(node) {
    switch (node.type) {
      case WORKFLOW_NODE_TYPES.INPUT:
        return this.handleInput(node);
      case WORKFLOW_NODE_TYPES.INTENT:
        return this.handleIntent(node);
      case WORKFLOW_NODE_TYPES.MEMORY:
        return this.handleMemory(node);
      case WORKFLOW_NODE_TYPES.PROMPT:
        return this.handlePrompt(node);
      case WORKFLOW_NODE_TYPES.AI:
        return this.handleAI(node);
      case WORKFLOW_NODE_TYPES.RESPONSE:
        return this.handleResponse(node);
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  handleInput(node) {
    this.context.input = this.context.userMessage || '';
    return node.next?.[0] || null;
  }

  handleIntent(node) {
    const intents = node.config?.intents || [];
    const message = (this.context.input || '').toLowerCase();
    const matched = intents.find((i) =>
      i.keywords?.some((kw) => message.includes(kw.toLowerCase()))
    );
    this.context.intent = matched?.name || node.config?.defaultIntent || 'general';
    const nextByIntent = node.config?.routing?.[this.context.intent];
    return nextByIntent || node.next?.[0] || null;
  }

  handleMemory(node) {
    const limit = node.config?.limit || 10;
    const history = this.context.conversationHistory || [];
    this.context.memory = history.slice(-limit);
    return node.next?.[0] || null;
  }

  handlePrompt(node) {
    const template = node.config?.template || '{{systemPrompt}}\nUser: {{input}}';
    const systemPrompt = this.context.aiConfig?.systemPrompt || 'You are a helpful assistant.';
    this.context.prompt = template
      .replace('{{systemPrompt}}', systemPrompt)
      .replace('{{input}}', this.context.input)
      .replace('{{intent}}', this.context.intent || '')
      .replace(
        '{{memory}}',
        this.context.memory.map((m) => `${m.sender}: ${m.text}`).join('\n')
      );
    return node.next?.[0] || null;
  }

  async handleAI(node) {
    const provider = node.config?.provider || this.context.aiConfig?.provider || 'mock';
    if (provider === 'mock') {
      this.context.aiResponse = this.generateMockResponse();
    } else {
      this.context.aiResponse =
        this.context.aiConfig?.fallbackMessage ||
        'AI provider integration pending. Connect OpenAI/Anthropic here.';
    }
    return node.next?.[0] || null;
  }

  generateMockResponse() {
    const brand = this.context.brandName || 'our store';
    const input = this.context.input || '';
    if (this.context.intent === 'product_inquiry') {
      return `At ${brand}, we have great options related to "${input}". Would you like recommendations or pricing?`;
    }
    return `Thanks for reaching out to ${brand}! Regarding "${input}" — how can I help you further?`;
  }

  handleResponse(node) {
    const template = node.config?.template || '{{aiResponse}}';
    this.context.finalResponse = template.replace('{{aiResponse}}', this.context.aiResponse);
    return null;
  }

  async run() {
    let currentNodeId = this.workflow.entryNodeId;
    const visited = new Set();
    const maxSteps = 50;
    let steps = 0;

    while (currentNodeId && steps < maxSteps) {
      if (visited.has(currentNodeId)) {
        logger.warn('Workflow cycle detected', { nodeId: currentNodeId });
        break;
      }
      visited.add(currentNodeId);
      steps += 1;

      const node = this.getNode(currentNodeId);
      if (!node) break;

      currentNodeId = await this.executeNode(node);
    }

    return (
      this.context.finalResponse ||
      this.context.aiResponse ||
      this.context.aiConfig?.fallbackMessage ||
      'I could not process your request.'
    );
  }
}

async function executeWorkflow(workflow, context) {
  const executor = new WorkflowExecutor(workflow, context);
  return executor.run();
}

module.exports = { WorkflowExecutor, executeWorkflow };
