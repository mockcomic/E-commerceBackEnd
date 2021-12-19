const router = require('express').Router();
const {
  Product,
  Category,
  Tag,
  ProductTag
} = require('../../models');

router.get('/', async (req, res) => {
  try {
    const data = await Product.findAll({
      include: [{
        model: Category,
        attributes: ['id', 'category_name']
      }],
      include: [{
        model: Tag,
        attributes: ['id', 'tag_name']
      }],
    });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  };
});

router.get('/:id', async (req, res) => {
  try {
    const data = await Product.findOne({
      where: {
        id: req.params.id
      },
      include: [{
        model: Category,
        attributes: ['id', 'category_name']
      }],
      include: [{
        model: Tag,
        attributes: ['id', 'tag_name']
      }],
    });
    if (!data) {
      res.status(404).json({
        message: 'No category with this id'
      });
      return;
    }
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  };
});

router.post('/', async (req, res) => {
  try {
    const data = await Product.create(req.body)
    res.status(300).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  };
});

router.put('/:id', async (req, res) => {
  try {
    Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    const productTags = await ProductTag.findAll({
      where: {
        product_id: req.params.id
      }
    })
    const productTagIds = await productTags.map(({
      tag_id
    }) => tag_id);

    const newProductTags = await req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });

    const productTagsToRemove = await productTags
      .filter(({
        tag_id
      }) => !req.body.tagIds.includes(tag_id)).map(({
        id
      }) => id);

    const updatedProductTags = await Promise.all([
      ProductTag.destroy({
        where: {
          id: productTagsToRemove
        }
      }),
      ProductTag.bulkCreate(newProductTags),
    ]);
    res.json(updatedProductTags)
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const data = await Product.destroy({
      where: {
        id: req.params.id
      }
    })
    res.json(data);
  } catch (error) {
    res.json(error);
  };
});

module.exports = router;