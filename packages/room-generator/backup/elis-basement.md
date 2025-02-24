# Eli's Basement

the basement is a converted root cellar, with a small stool bolted to the floor

it is not a comforting room and reminds you of far to many movies that you probably never should have watched

the light is just enough that you don't have to see too much.

it smells damp and somehow of bad faith.


```yaml
roomType: "Basement"
biomeType: "Prarie"
```

## a slightly charcoaled wooden trap door, leads upwards

```yaml
direction: Up
type: "Trapdoor"
material: "Wood"
```

### actions:

#### [the trap door, closes with a bang](elis-barn.md)

## a stick of slightly sweaty dynamite almost like a caricature ot itself. It's fused and certainly unstable and capable of turning things including you into a fine meaty mist still holding exciteable explosives couldn't hurt right?

```yaml
type: "Dynamite"
material: "TNT"
```

#### the dynamite detonates, you are lucky, the blast wave passes through you, you shit your pants involuntarily, you are spared the clean up by dint of now being largely composed of meaty paste. 

```yaml
type: "Explode"
enabled: false
```

#### the fuse comes into menacing life, sparkling like a demented god, the air fills with the smell of gunpowder, its not at all unpleasant

<!-- needs a timer like 3 actions pre it explodes so we need a specialised routine
    we might in fact handle this kind of thing but adding IV's and respective
    flags that we can check in main()
 -->
```yaml
type: "Light"
enabled: true
```

