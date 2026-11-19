// Browsing hierarchy for the Designs index. These ids refer to catalog entries, including
// linked Open+Pattern designs. Assign each entry once; the generator checks this list.
// Drafting blocks intentionally remain outside this hierarchy.
const section = (id, label, ids) => ({ id, label, ids: ids.trim().split(/\s+/) })

export const designGroups = [
  { id: 'outer-layers', label: 'Outer layers', image: 'balmacaan', sections: [
    section('everyday-coats', 'Everyday & winter coats', `balmacaan reefer carlita carlton girls-coat peacoat skirt-coat winter-coat womens-box-coat womens-peacoat`),
    section('tailored-coats', 'Tailored & dress coats', `box-overcoat fitted-overcoat overcoat princess-coat riding-frock-coat riding-habit-coat surtout three-piece-long-coat topcoat ulster`),
    section('protective-coats', 'Rain, work coats & parkas', `raincoat shop-coat openpattern-us-m1951-fishtail-parka-pattern`),
    section('capes-wraps', 'Capes & wraps', `cape cape-overcoat dolman-cape mantle inverness-coat`),
    section('rain-wind-jackets', 'Rain & wind jackets', `anorak openpattern-british-army-combat-rain-jacket-pattern harrington-jacket openpattern-us-pt-windbreaker-jacket windbreaker`),
    section('cold-weather-jackets', 'Cold-weather jackets', `openpattern-bundeswehr-reversible-jacket-snow openpattern-finnish-m62-reversible-jacket openpattern-ma-1-bomber-jacket-1971 mackinaw quilted-jacket openpattern-swedish-army-motorcycle-jacket-ordonnansjacka-m-1954 openpattern-swedish-army-m90-air-combat-jacket`),
    section('utility-jackets', 'Utility jackets', `openpattern-british-army-cs95-field-combat-smock field-jacket hunting-coat openpattern-swiss-m70-field-jacket openpattern-us-army-acu-jacket-2014 openpattern-us-army-bdu-jacket-1981 openpattern-us-army-m65-jacket openpattern-us-army-tropical-combat-jacket openpattern-us-tactical-smock`),
    section('everyday-jackets', 'Work & everyday jackets', `barbers-coat boys-work-coat chore-coat devon jett kimono-jacket military-tunic painters-jacket scout-coat`),
    section('suit-jackets', 'Suit jackets', `boys-suit-jacket dinner-jacket jaeger sack-coat smoking-jacket suit-jacket tailored-jacket`),
    section('dress-jackets', 'Shaped & dress jackets', `double-dart-jacket eton-jacket fitted-jacket frock-coat norfolk-jacket prince-albert-jacket tailcoat`),
  ] },
  { id: 'upper-layers', label: 'Upper layers', image: 'dress-shirt', sections: [
    section('shirts-overshirts', 'Shirts & overshirts', `button-middy dress-shirt service-shirt simon simone openpattern-swiss-m59-field-shirt openpattern-m83-swiss-overshirt`),
    section('blouses-smocks', 'Pullovers, blouses & smocks', `openpattern-british-army-cs95-ubacs-shirt openpattern-british-95-combat-shirt-pattern childrens-smock middy-blouse work-shirt`),
    section('tshirts-tanks', 'T-shirts & tanks', `aaron openpattern-loose-fit-t-shirt openpattern-slim-fit-t-shirt openpattern-standard-fit-t-shirt t-shirt teagan`),
    section('simple-tops', 'Other simple tops', `bibi diana shell-top tamiko tristan`),
    section('sweaters-hoodies', 'Sweaters, sweatshirts & hoodies', `cardigan hannah henley huey hugo sven turtleneck openpattern-us-navy-sweater yuri`),
    section('vests-waistcoats', 'Vests & waistcoats', `bar-vest openpattern-british-high-vis-vest db-waistcoat wahid waistcoat`),
  ] },
  { id: 'lower-layers', label: 'Lower layers', image: 'work-pants', sections: [
    section('everyday-trousers', 'Everyday & tailored trousers', `charlie jeans paco peg-pants sailor-pants slacks suit-trousers womens-trousers`),
    section('utility-trousers', 'Work & utility trousers', `openpattern-british-army-cs95-field-combat-trouser field-trousers scout-pants openpattern-swiss-m70-field-pant openpattern-us-army-combat-uniform-acu-pant work-pants`),
    section('draped-trousers', 'Draped & wrap trousers', `churidar salwar waralee`),
    section('shorts', 'Shorts', `ashley percy shale shorts`),
    section('breeches', 'Breeches & knee-length trousers', `boys-knickers breeches cornelius cycling-breeches golf-pants jodhpurs knee-pants`),
    section('full-skirts', 'Full & pleated skirts', `circular-skirt gathered-skirt kilt pleated-skirt sandy tiered-skirt`),
    section('fitted-skirts', 'Fitted & panelled skirts', `four-gore-skirt gored-skirt penelope tunic-skirt two-piece-skirt yoke-skirt`),
    section('divided-skirts', 'Divided & riding skirts', `apron-riding-skirt culottes riding-skirt`),
    section('active-bottoms', 'Stretch & active bottoms', `crux joggers lily lumina lumira`),
  ] },
  { id: 'one-piece', label: 'One-piece garments', image: 'shirtwaist-dress.short-sleeves', sections: [
    section('shaped-dresses', 'Shaped dresses & tunics', `fitted-dress fitted-kameez princess-dress sasha sophie wrap-dress`),
    section('relaxed-dresses', 'Relaxed dresses & tunics', `childs-dress frock kimono-dress pinafore shift-dress shirtwaist-dress kameez kalidar-kurta`),
    section('overalls-jumpsuits', 'Overalls & jumpsuits', `bib-overall jumpsuit opal overall-pants openpattern-tuta-jumpsuit-thayaht-1920`),
    section('baby-one-pieces', 'Baby one-pieces', `onyx otis`),
  ] },
  { id: 'close-to-body', label: 'Close-to-body & home', image: 'nightshirt', sections: [
    section('underwear', 'Underwear & foundations', `bloomers bruce cathrin drawers uma umbra`),
    section('sleepwear', 'Sleepwear & robes', `dressing-gown nightgown nightshirt pyjama-jacket pyjama-trousers`),
    section('swim-sport', 'Swim & sport tops', `bee sabrina shelly shin`),
  ] },
  { id: 'accessory-group', label: 'Accessories', image: 'accessories', sections: [
    section('hats', 'Hats', `florent holmes`),
    section('aprons-bibs', 'Aprons & bibs', `albert aprons bob`),
    section('neckwear-bags', 'Neckwear & bags', `benjamin hortensia trayvon`),
  ] },
]
