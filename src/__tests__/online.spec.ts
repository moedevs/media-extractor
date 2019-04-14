import {resolve} from "..";
import {looseMatch} from "./utils";

describe('Tenor', function () {
  it('tenor.com/*.gif', () => {
    return resolve("https://tenor.com/YpQf.gif").then(
      looseMatch("https://media1.tenor.com/images/4f0a48e9ca005beb43e9a1f23eba01b5/tenor.gif")
    )
  });

  it('tenor.com/view/*', function () {
    return resolve("https://tenor.com/view/ahagon-new-game-umiko-gif-13247685").then(
      looseMatch("https://media1.tenor.com/images/4b517146782c3e651a043fcbf288db3a/tenor.gif?itemid=13247685")
    )
  });
});
