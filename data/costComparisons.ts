export const costComparisons = {
  "m340i-vs-rs3": {
    title: "BMW M340i vs Audi RS3 Running Costs",
    car1Slug: "bmw-m340i",
    car2Slug: "audi-rs3",
    intro:
      "The BMW M340i and Audi RS3 are two of the most popular used performance cars in the UK. Both are fast, practical and desirable, but their ownership costs can differ significantly once fuel, insurance, maintenance and depreciation are included.",
    verdict:
      "The BMW M340i is usually the more comfortable and grown-up daily driver, while the Audi RS3 has the more special engine and stronger hot hatch appeal. The cheaper car to own will depend heavily on purchase price, insurance and depreciation, so comparing the full ownership cost is more useful than only looking at fuel economy.",
    faq: [
      {
        question: "Is the BMW M340i cheaper to run than the Audi RS3?",
        answer:
          "The BMW M340i can be cheaper in some areas such as comfort-focused daily use and insurance, but the Audi RS3 may hold value better. The total cost depends on mileage, purchase price, fuel costs and depreciation.",
      },
      {
        question: "Which is better as a daily driver, M340i or RS3?",
        answer:
          "The BMW M340i is usually the better long-distance daily driver, while the Audi RS3 feels more compact and aggressive.",
      },
      {
        question: "Which car has higher maintenance costs?",
        answer:
          "Both cars have performance-car running costs. The RS3 can be expensive for tyres, brakes and specialist maintenance, while the M340i also needs proper tyres, servicing and repair budgeting.",
      },
    ],
  },


"m140i-vs-golf-r": {
  title: "BMW M140i vs Golf R Running Costs",
  car1Slug: "bmw-m140i",
  car2Slug: "golf-r-mk75",
},

"330d-vs-a4-20-tdi": {
  title: "BMW 330d vs Audi A4 2.0 TDI Running Costs",
  car1Slug: "bmw-330d",
  car2Slug: "audi-a4-20-tdi",
},

"530d-vs-e220d": {
  title: "BMW 530d G30 vs Mercedes E220d Running Costs",
  car1Slug: "bmw-530d-g30",
  car2Slug: "mercedes-e220d",
},

"tesla-model-3-vs-bmw-320d": {
  title: "Tesla Model 3 vs BMW 320d Running Costs",
  car1Slug: "tesla-model-3",
  car2Slug: "bmw-320d",
},

"golf-gti-vs-octavia-vrs": {
  title: "Golf GTI vs Skoda Octavia vRS Running Costs",
  car1Slug: "golf-gti",
  car2Slug: "skoda-octavia-vrs",
},




};

export type CostComparisonSlug = keyof typeof costComparisons;