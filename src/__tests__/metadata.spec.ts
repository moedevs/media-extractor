import { metadata } from "../index";

test("metadata", () => {
  return metadata("https://tenor.com/YpQf.gif").then(console.log);
});
test("metadata giphy", () => {
  return metadata("https://www.reddit.com/r/SuzukazeAoba/comments/abfbyu/new_years_aoba/").then(console.log);
});

describe("gify", () => {
  it("gfycat", () => {
    return metadata("https://gfycat.com/flashyteemingamericancrow-pets-animals-screaming-goat-original").then(console.log);
  })
})


describe("pixiv", () => {
  it("pixiv", () => {
    return metadata("https://www.pixiv.net/member_illust.php?mode=medium&illust_id=74371352").then(console.log)
  })
})
