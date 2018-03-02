const supertest = require(`supertest`);
const path = require(`path`);
const {app} = require(`../server/server`);
const generateEntity = require(`../data/generate-entity`);

const apiUrl = `/api/posts`;

describe(`POST ${apiUrl}`, function () {
  it(`должен вернуть 400, тк приаттачиный файл обязателен`, () => {
    const mockData = generateEntity();

    return supertest(app)
        .post(apiUrl)
        .send(mockData)
        .expect(400);
  });

  it(`должен совпадать form-data`, () => {
    const mockData = {
      scale: 5,
      effect: `chrome`,
      hashtags: [`#биткоин`],
      description: `Губерниев в шоке от новости про мельдоний Крушельницкого`,
      likes: 432,
      comments: [
        `Губерниев в шоке от новости про мельдоний Крушельницкого`,
        `Ученые предположили человеческую реакцию на встречу с пришельцами`,
      ],
      date: 1234,
    };

    return supertest(app)
        .post(apiUrl)
        .attach(
            `image`,
            path.join(
                __dirname,
                `../server/posts/36268899-ce42264e-1288-11e8-82d7-2d8265398b9e.png`
            )
        )
        .field(`scale`, 5)
        .field(`effect`, `chrome`)
        .field(`hashtags[]`, `#биткоин`)
        .field(
            `description`,
            `Губерниев в шоке от новости про мельдоний Крушельницкого`
        )
        .field(`likes`, 432)
        .field(
            `comments[]`,
            `Губерниев в шоке от новости про мельдоний Крушельницкого`
        )
        .field(
            `comments[]`,
            `Ученые предположили человеческую реакцию на встречу с пришельцами`
        )
        .field(`date`, 1234)
        .expect(200, mockData);
  });

  it(`не существующий адрес должен вернуть 404`, () => {
    return supertest(app)
        .post(`/api/unknown-address`)
        .expect(404)
        .expect(`Content-Type`, /html/);
  });
});
