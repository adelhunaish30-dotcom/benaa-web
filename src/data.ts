import { MaterialItem, ConcreteGrade } from './types';

export const INITIAL_MATERIALS: MaterialItem[] = [
  {
    id: 'mat_cem_1',
    name: 'Portland Cement OPC 53 Grade',
    category: 'Cement',
    supplier: 'Holcim Industrial',
    rating: 4.8,
    price: 12.50,
    unit: 'Bag (50kg)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAX1lBwxECzjLUO-AxhDxcpsMOc_4ie8Hhj3cDBLjV-P9t_p8Ni19pI91UGDi2C4W74VHSudLXWuvnj7LAZUC_I0k1XOEaqpTgKBiG0LlPiI-wrq-1oZAcsk1GCmP8JiG0ySEYV6GZoYsrm5zQ3QiXTaVR21XtVkeVhzpUbITO0tz5iey_l0qimly47serBz4Ld-tJW200yYyEfVcDqzK-0EYVUHh6qye3vB6FcN1zBaofoEIDf59P3v3Bou8vC4qPW6oSjRuTK0xw',
    verified: true
  },
  {
    id: 'mat_steel_1',
    name: 'Fe500D TMT Reinforcement Bars',
    category: 'Steel',
    supplier: 'ArcelorMittal',
    rating: 4.9,
    price: 850.00,
    unit: 'Metric Ton',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDe4JPOtfEKckBQEr5I4UkTP3oJDR1GFkDZWF1SvM5JQLNvJHDPQmaW1EJaoZGyFGVFHxR1xfsvdhbrr_69qcJ2i-CJcqcWvjaDeI3uasjSx8URS9vXcGNeC0IZThj4KOTuNDqr_VKSfWO1OxRuPTPxDNhmI4h3szXUoDnUfuwUgLTM3ND43U8CxMdPhDEW73cuFRx-cyCkqzNBnUgdaUqzh-ZNZoPXtjvK1lVfCM93pncrFUt77e-uLWQdDdm78s-grtQ9kHdaT4',
    topRated: true
  },
  {
    id: 'mat_brick_1',
    name: 'High Strength Fired Clay Bricks',
    category: 'Bricks',
    supplier: 'Precision Masonry',
    rating: 4.5,
    price: 0.45,
    unit: 'Piece',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFtqFcrDKI0PQaRz0w7-kc06e4FIVZ38GjG6CeHgKgIp3b7buizqsBDFipXcpX0_fU4WdT_0anaIqmL4bcMQ4x4Jwim1ATWBvn_J740l9RkfJSTDlD7LJQ7wtDM2U184vkSetBas4zPWiebumY18vyFHExL7hiDifdeEcO1-oDgx-A8_RD1UQlF1P2HVKa_87Kc_VQM5rA7e3qC1UBXkMo0NS_6ApxzKT3e70mcNSGFE1p03G2fqfbtqFS_4Ac37taoix06YiJJu8'
  },
  {
    id: 'mat_cem_2',
    name: 'UltraTech OPC 53 Grade Strong Cement',
    category: 'Cement',
    supplier: 'UltraTech Cement LLC',
    rating: 4.7,
    price: 14.50,
    unit: 'Bag (50kg)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqvHkKXOx12bUAukKjLM3T-FTT1Qs96pW8ULrGxdsf8ndCrcYSp9TiVF7-1Dd8W4wEnzimOjAlCDrtt3LUAXR7h3u6S4d48hLv4Igw3m9yJsoZ5_8iKYN7Y4EThh33Haj3L0bJK6sM2WH8SUFRw7BSksv2CBU37r1ZvlHh0P0ARwQTHtA_iMjrx5bj7avNbx_crZ-FXjCbyTSsIs3HD9HcRFA2xpIr-2tU15rq9yh0Uvd9nbh25isigG0zJhXQx_RswMKh6e62S9k',
    topRated: true
  },
  {
    id: 'mat_steel_2',
    name: 'TMT FE-500D Structural Rebar Bundle',
    category: 'Steel',
    supplier: 'Tata Steel Industrial',
    rating: 4.8,
    price: 620.00,
    unit: 'Metric Ton',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr7oEi4ZKpjyQx_X01gYbrlDCjVnk4jRfkJl-uDl1ie2Jp5yHja9WQaGD6Q3KAYu4BCALr7SfzFfMALBN6KA0fUUGJ_Z1eJz-eQyOxkmIUDQsQs60Z3umKN3rCArtkTasU29MCNHpYbDkhDfOWW61lo102gJgozScx1XtEgRMQhFXCA3Ucd2xo5D1kDIItaUsY_IH1Cdm4_l1bWqzytxZkIaQ8QyU14lGQwBUnOzuCEn1RtCpoLrkye4pgxrhNV_94_AND7ThDqGk'
  },
  {
    id: 'mat_brick_2',
    name: 'Premium First-Class Red Clay Bricks',
    category: 'Bricks',
    supplier: 'Al-Benaa Masonry',
    rating: 4.6,
    price: 185.00,
    unit: '1k Units',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCNraCK-o83HM_WeJojHYSV1g1QZFzX0gjqc5YoC8O_3f0W8hCrRXi5RTk63Iw7WHRQ4ltAsjl-mbhVt3JGsP0OVNd9MczcLirdon4Cz3laWIg5-bWhaJrcAC0yeVC31GpaQf4U9BPQhnDtkXKcxoCpVDDTOKcdWAP-feF1adlp2sWhRlOI2RYxQjRsostZxxTPemWWFrFLTnh_8jE7OWdygNCWKSxsHKJI3r54fxpJDqQahabglPNT0N0tImkVHphX_acTEe_G-k'
  },
  {
    id: 'mat_safe_1',
    name: 'Advanced Ventilation Safety Helmet',
    category: 'Safety',
    supplier: 'MSA Safety Equipment',
    rating: 4.7,
    price: 24.99,
    unit: 'Unit',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgjf39dSiPE839HCBUhjwGexkFKWkxKQesGYrQ4A4S7yAcrD_FvIi2o3gbOTzk6WXLs8v0DSdCeS4hFAACNHovaUduClyDl97u2QEEJYtthkMF9B6TVzioJ8oqEgwQQN8BzWdKJlGrZh82-Xbv0RLYvSZavz2VDStPzk3QULsYQr2UEs-9GdfGsMehrG0e969IAOjedpd1U46vafSZ08ZSVzuIJPT07FgQExolbALt7JXfeeJ3i0cPnzIQ3v2EEGRgFKBmtwCRFcs',
    verified: true
  },
  {
    id: 'mat_agg_1',
    name: 'Coarse Sand Zone II Premium',
    category: 'Aggregates',
    supplier: 'Apex Aggregates',
    rating: 4.4,
    price: 45.00,
    unit: 'Metric Ton',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDe4JPOtfEKckBQEr5I4UkTP3oJDR1GFkDZWF1SvM5JQLNvJHDPQmaW1EJaoZGyFGVFHxR1xfsvdhbrr_69qcJ2i-CJcqcWvjaDeI3uasjSx8URS9vXcGNeC0IZThj4KOTuNDqr_VKSfWO1OxRuPTPxDNhmI4h3szXUoDnUfuwUgLTM3ND43U8CxMdPhDEW73cuFRx-cyCkqzNBnUgdaUqzh-ZNZoPXtjvK1lVfCM93pncrFUt77e-uLWQdDdm78s-grtQ9kHdaT4'
  },
  {
    id: 'mat_plumbing_1',
    name: 'Heavy Duty PVC High-Pressure Pipes 110mm',
    category: 'Plumbing',
    supplier: 'Benaa Plastics',
    rating: 4.7,
    price: 18.20,
    unit: '6m Length',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAX1lBwxECzjLUO-AxhDxcpsMOc_4ie8Hhj3cDBLjV-P9t_p8Ni19pI91UGDi2C4W74VHSudLXWuvnj7LAZUC_I0k1XOEaqpTgKBiG0LlPiI-wrq-1oZAcsk1GCmP8JiG0ySEYV6GZoYsrm5zQ3QiXTaVR21XtVkeVhzpUbITO0tz5iey_l0qimly47serBz4Ld-tJW200yYyEfVcDqzK-0EYVUHh6qye3vB6FcN1zBaofoEIDf59P3v3Bou8vC4qPW6oSjRuTK0xw',
    verified: true
  }
];

export const CONCRETE_GRADES: ConcreteGrade[] = [
  {
    code: 'M25',
    ratio: '1:1:2',
    description: 'Heavy Structural works, columns, high-load beams, slabs',
    cementRatio: 1,
    sandRatio: 1,
    aggregateRatio: 2
  },
  {
    code: 'M20',
    ratio: '1:1.5:3',
    description: 'Standard Reinforced concrete structures, footings, foundations',
    cementRatio: 1,
    sandRatio: 1.5,
    aggregateRatio: 3
  },
  {
    code: 'M15',
    ratio: '1:2:4',
    description: 'Non-structural masonry support, residential flooring, pathways',
    cementRatio: 1,
    sandRatio: 2,
    aggregateRatio: 4
  }
];
export const INTUITIVE_TIPS = [
  "المواد المتطابقة مع مواصفات ASTM توفر حتى 15% من الانبعاثات الكربونية في التصنيع.",
  "نسبة الخلط القياسية لـ M25 تتطلب 1 جزء أسمنت، 1 جزء رمل، و2 جزء ركام خشن.",
  "يمكنك تصدير تقدير ميزانية البناء كملف PDF متكامل بضغطة واحدة من القائمة الجانبية."
];
