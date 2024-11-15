# Quadkey Navigator

Quadkey Navigator is a simple website that visualises quadkeys.

![Quadkey Navigator Screenshot](https://raw.githubusercontent.com/dchirst/quadkey-io/cb17f447252cf62df228dbd15742754c545613a3/MDMedia/screenshot.jpg)

## What are Quadkeys?

Thanks for asking! Quadkeys are a a 1 dimensional way of tiling up a map.

Web maps split the world into squares so that they can render parts of the map separately. Usually, these tiles are
represented by 3 numbers: the `x` coordinate, the `y` coordinate, and the `z` zoom level. 

Quadkeys combine these 3 values into a single string made up of the numbers 0 to 3. Each string represents a single tile
at a specific zoom level. 

You can tell the zoom level of a quadkey by the length of the string. For example, quadkey `230` is at zoom level 3 
because it's 3 characters long.

Each quadkey is made up of 4 smaller quadkeys at the next zoom level which are made up of the quadkey id plus 
0, 1, 2, or 3. For example, quadkey `230` the quadkeys `2300`, `2301`, `2302`, and `2303`.

![Quadkey Visualisation](https://raw.githubusercontent.com/dchirst/quadkey-io/cb17f447252cf62df228dbd15742754c545613a3/MDMedia/quadkey_example.jpg)

# Installation

To run the website locally, you can clone the repository and run the following commands:

```bash
npm install
npm run dev
```