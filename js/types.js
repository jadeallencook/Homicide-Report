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