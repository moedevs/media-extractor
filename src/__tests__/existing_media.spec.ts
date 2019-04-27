import { match } from "./utils";

const matchIdentical = (url: string) => match(url, url);

test("discord:png", matchIdentical(
  "https://media.discordapp.net/attachments/453354438267240458/571543150854799361/image0.png"
));

test("tenor:gif", matchIdentical(
  "https://media.tenor.com/images/af1aa90dea2c52e3d5776d51e7ea1fcc/tenor.gif"
));
