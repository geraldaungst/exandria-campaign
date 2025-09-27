---
type: note
kind: fact/relationship
created: 2024-12-22
context: 
processed: no
tags:
 - atomic
 - to-process
---
# Core Information
## Pudgy Pigeon Menu
### Wine List
**_Bubbly Mace Chardonnay_**  
A locally produced white wine with a bouquet that is dry and leathery.  
Bottle price: 2 gp, 6 sp  
Glass price: 8 sp, 8 cp

**_Lost Sword Gewürztraminer_**  
A locally produced white wine with a bouquet that is powerful and rough.  
Bottle price: 2 gp, 6 sp  
Glass price: 8 sp, 7 cp

**_Sour Cardinal Merlot_**  
A finely made red wine that is described as fruity, dry, and herbaceous.  
Bottle price: 7 gp, 8 sp  
Glass price: 2 gp, 6 sp

**_Frightened Drum Gewürztraminer_**  
A famous vintage of white wine with a bouquet that is sweet, soft, and powerful.  
Bottle price: 11 gp, 5 sp  
Glass price: 3 gp, 8 sp

### Lagers & Ales
**_Jagged Grape Lager_**  
6% ABV  
An imported light lager. Described as a complex lager with a sweet finish.  
Gallon price: 5 sp, 2 cp  
Pint price: 1 sp

**_Violet Glaive Porter_**  
6.5% ABV  
A locally brewed copper-colored porter. Described as a robust porter with a sweet finish.  
Gallon price: 5 sp, 4 cp  
Pint price: 1 sp

**_Old Book Hard Cider_**  
6.55% ABV  
An imported reddish cider. Described as a robust cider with a sour finish.  
Gallon price: 5 sp, 4 cp  
Pint price: 1 sp

**_Verdant Crow Lager_**  
6.73% ABV  
An imported light brown lager. Described as a nutty lager with a sour finish.  
Gallon price: 5 sp  
Pint price: 1 sp

### Liquors
**_Green Cardinal Whiskey_**  
An imported rye whiskey.  
Bottle price: 3 gp, 3 sp  
Shot price: 5 sp, 6 cp

**_Draconic Tree Vodka_**  
A locally produced corn vodka.  
Bottle price: 2 gp, 4 sp  
Shot price: 4 sp

**_Loveless Orc Whiskey_**  
A locally produced corn whiskey.  
Bottle price: 2 gp, 4 sp  
Shot price: 4 sp, 1 cp

**_House Whiskey_**  
A house-made corn whiskey.  
Bottle price: 1 gp, 8 sp  
Shot price: 3 sp

### Food Menu
#### Starters
**_Jerky Strips_**  
A basket of several strips of turkey jerky.  
2 sp, 4 cp

**_Deep-Fried Chicken Strips_**  
Chicken strips fried in vegetable oil. Served with a honey-based sauce.  
4 sp, 5 cp

**_Deep-Fried Onion Rings_**  
Onion rings fried in butter. Served with a creamy sauce.  
4 sp, 6 cp

**_Packed Lettuce Bowls_**  
A platter of lettuce bowls packed with a medley of meat, sour cream, and onion.  
5 sp, 4 cp

#### Soups & Salads
**_Scallop Soup_**  
A rich soup with scallops, barley, and onions.  
3 sp, 5 cp

**_Ham Chowder_**  
A tasty chowder with hearty chunks of ham, dumplings, peas, and carrots.  
3 sp, 5 cp

**_Blackened Ham and Red Lettuce Salad_**  
Leaves of red lettuce tossed with green peppers. Topped with blackened ham.  
3 sp, 6 cp

**_Grilled Ham and Iceberg Salad_**  
Leaves of iceberg tossed with baby artichokes and cucumbers. Topped with grilled ham.  
3 sp, 4 cp

#### Entrees
**_Herb-crusted Venison_**  
Herb-crusted chunks of venison in a cream sauce served with mashed potatoes and a helping of turnips.  
7 sp, 1 cp

**_Braised Duck_**  
Braised chunks of duck in red sauce alongside pasta and a helping of kale.  
7 sp, 2 cp

**_Braised Lamb_**  
Braised strips of lamb in red sauce alongside quinoa and carrots.  
7 sp

**_Rotisserie-cooked Frog_**  
Rotisserie-cooked slices of frog with a ginger marinade served over mashed potatoes with a serving of mushrooms and green beans.  
7 sp

# Connections
## Source Note
[[The Pudgy Pigeon]]

## Related Atomic Notes
```dataview
LIST
FROM #atomic
WHERE contains(file.outlinks, this.file.link) OR contains(file.inlinks, this.file.link)
```

## Related NPCs
```dataview
LIST
FROM #npc 
WHERE contains(file.outlinks, this.file.link) OR contains(file.inlinks, this.file.link)
```

## Related Plot Threads
```dataview
LIST
FROM #plot  
WHERE contains(file.outlinks, this.file.link) OR contains(file.inlinks, this.file.link)
```

## Related Locations
```dataview
LIST
FROM #location 
WHERE contains(file.outlinks, this.file.link) OR contains(file.inlinks, this.file.link)
```

## Related Items/Artifacts
```dataview
LIST
FROM #artifact 
WHERE contains(file.outlinks, this.file.link) OR contains(file.inlinks, this.file.link)
```
