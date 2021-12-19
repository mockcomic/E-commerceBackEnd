const router = require('express').Router();
const {
  Tag,
  Product,
  ProductTag
} = require('../../models');


router.get('/', async (req, res) => {
  try {
    const data = await Tag.findAll({
      include: [{
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock']
      }]
    });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  };
});

router.get('/:id', async (req, res) => {
  try {
    const data = await Tag.findOne({
      where: {
        id: req.params.id
      },
      include: [{
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
      }]
    });
    if (!data) {
      return res.status(404).json({
        message: 'No tag with this id'
      })
    };
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  };
});

router.post('/', async (req, res) => {
  try {
    const data = await Tag.create(req.body)
    res.json(data)
  } catch (error) {
    res.json(error);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = await Tag.update({
      tag_name: req.body.tag_name
    }, {
      where: {
        id: req.params.id
      }
    })
    res.json(data);
  } catch (error) {
    console.log(error);
    res.json(error);
  };
});

router.delete('/:id', async (req, res) => {
  try {
    const data = await Tag.destroy({
      where: {
        id: req.params.id
      },
    });
    res.json(data);
  } catch (error) {
    res.json(error);
  };
});

module.exports = router;