const router = require('express').Router();
const {
  Category,
  Product
} = require('../../models');

router.get('/', async (req, res) => {
  try {
    const data = await Category.findAll({
      include: [{
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock']
      }]
    })
    res.json(data)
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  };
});

router.get('/:id', async (req, res) => {
  try {
    const data = await Category.findOne({
      where: {id: req.params.id},
      include: [{
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
      }]
    });
    if (!data) {
      return res.status(404).json({message: 'No category with this id'});
    };
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  };
});

router.post('/', async (req, res) => {
  try {
    const data = await Category.create(req.body);
    res.json(data);

  } catch (error) {
    res.json(error);
  };
});

router.put('/:id', async (req, res) => {
  try {
    const data = await Category.update(
      {category_name: req.body.category_name}, 
      {where: {id: req.params.id}})
    res.json(data);
  } catch (error) {
    console.log(error);
    res.json(error);
  };
});

router.delete('/:id', async(req, res) => {
  try {
    const data = awaitCategory.destroy({where: {id: req.params.id}});
    res.json(data);
  }
  catch (error){
    res.json(error);
  };
});

module.exports = router;