import {resolve} from "..";
import {match} from "./utils";

describe('Giphy', function () {
  it('giphy.com/gifs/*', async () => {
    return resolve("https://giphy.com/gifs/spice-qxMuoLzyR3qi4").then(
      match("https://media.giphy.com/media/qxMuoLzyR3qi4/giphy.gif")
    )
  });
});
