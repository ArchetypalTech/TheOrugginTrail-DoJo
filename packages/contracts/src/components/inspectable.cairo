// just a draft for inspectable component

#[derive(Component, Copy, Drop, Serde)]
struct Inspectable {
    #[key]
    pub hasComponent: bool,
}
