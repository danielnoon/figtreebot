const people = [
  "Sam",
  "Zach",
  "Daniel",
  "Jack Moore",
  "Christiaan",
  "Beni",
  "Elwyn"
]

module.exports = {
  "pyr": (params, msg) => {
    msg.channel.send("```\n" + (s => {
      let a = s.split("").map((d, i) => {
        let c = "";
        for (let j = i; j < s.length; j++) c += s[j];
        return c;
      })
      return a.join("\n");
    })(params.join(" ")) + "\n```").then(() => msg.delete());
  },
  "corner": (params, msg) => {
    msg.channel.send((x => x.split("").map((a, b) => ((b == 0) ? x + "\n" : a + "\n")).join(""))(params.join(" "))).then(() => msg.delete());
  },
  "retard": (params, msg) => {
    if (params.length != 0) {
      msg.channel.send((s => ">" + s.split("").map((d, i) => i % 2 ? d.toLowerCase() : d.toUpperCase()).join(""))(params.join(" "))).then(() => msg.delete())
    }
    else {
      let rand = Math.floor(Math.random() * (people.length - 1));
      msg.reply(people[rand] + " is a retard.");
    }
  }
}