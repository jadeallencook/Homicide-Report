// 15 - 21

clear();
types = {};
for (let homicide of homicides) {
	if (!types[homicide.type] && homicide.age > 14 && homicide.age < 22) {
		types[homicide.type] = {
			num: 1,
			cases: [homicide]
		}
	} else if (types[homicide.type] && homicide.age > 14 && homicide.age < 22) {
		types[homicide.type].num++;
		types[homicide.type].cases.push(homicide);
	}
}
console.log(types);

// all 

clear();
types = {};
for (let homicide of homicides) {
	if (!types[homicide.type]) {
		types[homicide.type] = 1;
	} else {
		types[homicide.type]++;
	}
}
console.log(types);