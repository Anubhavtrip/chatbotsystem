const { validateEvent, analyticsEventSchema } = require('../utils/eventValidator');
const analyticsRepository = require('../../../repositories/analytics.repository');

async function processAnalyticsEvent(payload) {
  const event = validateEvent(analyticsEventSchema, payload);
  await analyticsRepository.create({
    brandId: event.brandId,
    eventType: event.eventType,
    userId: event.userId,
    conversationId: event.conversationId,
    payload: event.payload,
  });
}

module.exports = { processAnalyticsEvent };
