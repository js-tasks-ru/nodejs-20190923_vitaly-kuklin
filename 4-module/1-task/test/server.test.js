const server = require('../server');
const request = require('request');
const expect = require('chai').expect;
const fse = require('fs-extra');
const path = require('path');

const filesFolder = path.resolve(__dirname, '../files');
const fixturesFolder = path.resolve(__dirname, './fixtures');

describe('4-module-1-task', () => {
  describe('тесты на файловый сервер', () => {
    before((done) => {
      fse.emptyDirSync(filesFolder);
      server.listen(3001, () => done());
    });
    after((done) => {
      fse.emptyDirSync(filesFolder);
      fse.writeFileSync(path.join(filesFolder, '.gitkeep'), '');
      server.close(done);
    });

    beforeEach(() => {
      fse.emptyDirSync(filesFolder);
    });

    describe('GET', () => {
      it('файл отдается по запросу', (done) => {
        fse.copyFileSync(
            path.join(fixturesFolder, 'index.js'),
            path.join(filesFolder, 'index.js')
        );

        const content = fse.readFileSync(path.join(filesFolder, 'index.js'));

        request.get('http://localhost:3001/index.js', (err, response, body) => {
          if (err) return done(err);

          expect(response.statusCode, 'статус код ответа 200').to.equal(200);
          expect(
              body,
              'ответ сервера - исходный файл index.js'
          ).to.equal(content.toString('utf-8'));
          done();
        });
      });

      it('если файла нет - отдается 404', (done) => {
        request.get(
            'http://localhost:3001/not_exists.png',
            (error, response) => {
              if (error) return done(error);

              expect(response.statusCode).to.equal(404);
              done();
            }
        );
      });

      it('если путь вложенный - возвращается ошибка 400', (done) => {
        request.get(
            'http://localhost:3001/nested/path',
            (error, response) => {
              if (error) return done(error);

              expect(response.statusCode).to.equal(400);
              done();
            }
        );
      });
    });
  });
});
