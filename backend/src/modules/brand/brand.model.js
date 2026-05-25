const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema(
  {
    primaryColor: { type: String, default: '#000000' },
    secondaryColor: { type: String, default: '#ffffff' },
    logoUrl: String,
    fontFamily: { type: String, default: 'Inter, sans-serif' },
    borderRadius: { type: String, default: '8px' },
  },
  { _id: false }
);

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    theme: { type: themeSchema, default: () => ({}) },
    isActive: { type: Boolean, default: true },
    settings: {
      timezone: { type: String, default: 'UTC' },
      language: { type: String, default: 'en' },
      maxConversationsPerUser: { type: Number, default: 50 },
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

brandSchema.index({ slug: 1 });
brandSchema.index({ ownerId: 1 });

module.exports = mongoose.model('Brand', brandSchema);
