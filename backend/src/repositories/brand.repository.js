const Brand = require('../modules/brand/brand.model');

const brandRepository = {
  create(data) {
    return Brand.create(data);
  },

  findById(id) {
    return Brand.findById(id);
  },

  findBySlug(slug) {
    return Brand.findOne({ slug });
  },

  findByOwner(ownerId) {
    return Brand.find({ ownerId, isActive: true }).sort({ createdAt: -1 });
  },

  updateById(id, data) {
    return Brand.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },
};

module.exports = brandRepository;
