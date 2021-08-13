const turf = require('@turf/turf');
const fs = require('fs');

const data = JSON.parse(
  fs.readFileSync('../../../dist/data/ivblocks_rev.json', 'utf-8'),
);

const newData = {
  ...data,
  features: data.features.map((d) => ({
    ...d,
    geometry: {
      ...d.geometry,
      coordinates: turf.rewind(turf.polygon(d.geometry.coordinates), {
        reverse: true,
      }).geometry.coordinates,
    },
  })),
};

fs.writeFileSync('../../../dist/data/ivblocks.json', JSON.stringify(newData));
