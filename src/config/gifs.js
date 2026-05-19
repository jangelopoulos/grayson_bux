export const ANGRY_GIFS = [
  "https://tenor.com/embed/7058302348984723881",
  "https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUycm9hcGI2NDQ2ZWx3b2d0ZTBicmF2Y2hwbnVxczd0NW9zejZlZG41dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RuYPi0HyBnOxy/giphy.gif",
  "https://media1.giphy.com/media/v1.Y2lkPTZjMDliOTUyZ3plbTU2d3NoNnRmb2I2bWJ6NmZuMXYwNmgxN2VlMmt0czh1MXNzciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/eb4WGfjWeIsgM/giphy.gif",
  "https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUydDY1ZXR6bWg3Y2ZvN2pibHBiNXA3cWNwazNodjE3cjFodmU4N3I3ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7LgKUsZiSjcRO/giphy.gif",
  "https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUycmxnMWllYTl3dHpmempueXRmdGVzcG50NHRianJrbW9pdXZ0Y2l5bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SNEudVcprbwOk6Nkp2/giphy.gif",
];

export const CONGRATS_GIF = "https://tenor.com/embed/13500890569322376370";

export function randomAngryGif() {
  return ANGRY_GIFS[Math.floor(Math.random() * ANGRY_GIFS.length)];
}
