import express from 'express';
import MarketplaceItem from '../models/Marketplace.js';

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const items = await MarketplaceItem.find();
    res.json(items);
  } catch (error) {
    console.error("error fetching data from the marketplace");
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

router.post("/seed", async (req, res) => {
  try {
    const items = [
      {
        name: 'Dog Food - Premium Quality',
        seller: 'Pet Supplies Co.',
        image: 'https://www.shutterstock.com/image-photo/brown-cat-dog-kibble-metal-260nw-2425714885.jpg',
        link: 'https://www.amazon.com/dog-food',
      },
      {
        name: 'Cat Food - Healthy Choice',
        seller: 'Cat Lovers Inc.',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ38bimpFXZ5Xih3JaSOeTCx-2LKDx-53nZSQ&s',
        link: 'https://www.amazon.com/cat-food',
      },
      {
        name: 'Cow Feed - Organic',
        seller: 'Farm Supplies',
        image: 'https://5.imimg.com/data5/SELLER/Default/2020/12/EV/YZ/VF/8371915/cow-cattle-feed.jpg',
        link: 'https://www.amazon.in/s?k=cattle+feed+amazon&adgrpid=85102050397&ext_vrnc=hi&hvadid=590493677911&hvdev=c&hvlocphy=9298871&hvnetw=g&hvqmt=e&hvrand=14223594691911480668&hvtargid=kwd-1056151157726&hydadcr=29684_2348702&mcid=37bff8be72863accbac2fb11d07fad45&tag=googinhydr1-21&ref=pd_sl_7l9dp4sg42_e',
      },
      {
        name: 'Dog Leash - Durable',
        seller: 'Pet Gear',
        image: 'https://m.media-amazon.com/images/I/71r9bWaogUL.jpg',
        link: 'https://www.amazon.in/s?k=amazon+dog+leash&adgrpid=58344687749&ext_vrnc=hi&hvadid=763396801097&hvdev=c&hvlocphy=9298871&hvnetw=g&hvqmt=e&hvrand=3544542759516452390&hvtargid=kwd-304982048064&hydadcr=22657_2354497&mcid=6dd5766e5aa439a28b0cf8fa45524c69&tag=googinhydr1-21&ref=pd_sl_961275pu31_e',
      },
      {
        name: 'Cat Leash - Adjustable',
        seller: 'Kitty Comforts',
        image: 'https://www.jiomart.com/images/product/original/rvfrsnkhkw/qpets-cat-harness-with-1-5m-leash-cat-belt-adjustable-size-breathable-cat-vest-strap-with-safety-reflective-strip-cat-leash-with-harness-for-small-cat-and-dog-m-red-product-images-orvfrsnkhkw-p610107041-0-202410181532.jpg?im=Resize=(1000,1000)',
        link: 'https://www.amazon.in/s?k=amazon+cat+leash&adgrpid=156425532459&gad_source=1&hvadid=763274221641&hvdev=c&hvlocphy=9298871&hvnetw=g&hvqmt=e&hvrand=11056952997070086995&hvtargid=kwd-342539353634&hydadcr=22657_2354497&mcid=8b23c121b3ad31ef9254064ced182f70&tag=googinhydr1-21&ref=pd_sl_9rf70dieb3_e',
      },
      {
        name: 'Pet Bed - Comfortable',
        seller: 'Comfort Pet Supplies',
        image: 'https://m.media-amazon.com/images/I/816k1+VUl4L.jpg',
        link: 'https://www.amazon.in/s?k=amazon+pet+bed&adgrpid=61651487249&ext_vrnc=hi&hvadid=590285253119&hvdev=c&hvlocphy=9298871&hvnetw=g&hvqmt=e&hvrand=10087528189237904036&hvtargid=kwd-321504087040&hydadcr=16055_2266003&mcid=5d5db92fcdd73f4e8651c4f3e4b97b30&tag=googinhydr1-21&ref=pd_sl_5tpsb64qvu_e',
      },
    ];
    await MarketplaceItem.insertMany(items);
    res.status(201).json({ message: 'Marketplace data seeded successfully' });
  } catch (error) {
    console.error("Faile dto seed the data");
    res.status(500).json({ error: 'Failed seeding' });
  }
});

export default router;