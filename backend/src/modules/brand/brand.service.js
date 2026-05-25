const brandRepository = require('../../repositories/brand.repository');
const cacheService = require('../../services/cache.service');
const AppError = require('../../utils/AppError');
const { HTTP_STATUS } = require('../../constants');

const brandService = {
  async create(data, ownerId) {
    const existing = await brandRepository.findBySlug(data.slug);
    if (existing) {
      throw new AppError('Brand slug already exists', HTTP_STATUS.CONFLICT);
    }

    const brand = await brandRepository.create({ ...data, ownerId });
    await cacheService.setBrand(brand._id.toString(), brand);
    return brand;
  },

  async update(brandId, data, userId) {
    const brand = await this.getById(brandId);
    if (brand.ownerId.toString() !== userId) {
      throw new AppError('Not authorized to update this brand', HTTP_STATUS.FORBIDDEN);
    }

    const updated = await brandRepository.updateById(brandId, data);
    await cacheService.invalidateBrand(brandId);
    return updated;
  },

  async getById(brandId) {
    const cached = await cacheService.getBrand(brandId);
    if (cached) return cached;

    const brand = await brandRepository.findById(brandId);
    if (!brand) {
      throw new AppError('Brand not found', HTTP_STATUS.NOT_FOUND);
    }

    await cacheService.setBrand(brandId, brand);
    return brand;
  },

  async getConfig(brandId) {
    const brand = await this.getById(brandId);
    return {
      brandId: brand._id,
      name: brand.name,
      slug: brand.slug,
      theme: brand.theme,
      settings: brand.settings,
      isActive: brand.isActive,
    };
  },
};

module.exports = brandService;
