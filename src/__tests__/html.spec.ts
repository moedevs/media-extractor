import { match } from "./utils";

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

test("pixiv:png", match(
  "https://www.pixiv.net/member_illust.php?mode=medium&illust_id=58103553",
  "https://embed.pixiv.net/decorate.php?illust_id=58103553"
));

test("imgbb:png", match(
  "https://ibb.co/qNfjgxM",
  "https://i.ibb.co/7n5CpbJ/57673381-p0.png"
))

test("imgur:png", match(
  "https://imgur.com/gallery/nhgYU4J",
  "https://i.imgur.com/nhgYU4J.png"
))
