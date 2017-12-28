cities = {};
for (let homicide of homicides) {
	if (!cities[homicide.city]) {
		cities[homicide.city] = 1;
    } else {
		cities[homicide.city]++;
    }
}
clear();
console.log(cities);