import { MediaClient } from "../client";
import { generateMatcher } from "./utils";

const client = new MediaClient();
const match = generateMatcher(client);

test("tenor.com:gif", match(
  "https://tenor.com/YpQf.gif",
  "https://media1.tenor.com/images/4f0a48e9ca005beb43e9a1f23eba01b5/tenor.gif?testemid=11976669"
));

test("zerochan.net:jpg", match(
  "https://www.zerochan.net/2019133",
  "https://static.zerochan.net/Suzukaze.Aoba.full.2019133.jpg"
));

test("reddit.com:jpg", match(
  "https://www.reddit.com/r/SuzukazeAoba/comments/abfbyu/new_years_aoba/",
  "https://external-preview.redd.it/Y8qv0tA4peHIXZRgIngTpf8eIQ2zOh62CAhdanIuBkU.jpg?auto=webp&s=fa4f53fccbe6f4a79f0e0b9a8e781b2b005e5ff9"
));

test("gfycat.com:gif", match(
  "https://gfycat.com/flashyteemingamericancrow-pets-animals-screaming-goat-original",
  "https://thumbs.gfycat.com/FlashyTeemingAmericancrow-size_restricted.gif"
));

