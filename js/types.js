types = {};
for (let homicide of homicides) {
	if (!types[homicide.type] && homicide.age > 14 && homicide.age < 22) {
		types[homicide.type] = 1;
    } else {
		types[homicide.type]++;
    }
}
clear();
console.log(types);