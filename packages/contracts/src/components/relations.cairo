use dojo::world::{WorldStorage};
use dojo::model::{ModelStorage};
use the_oruggin_trail::models::object::{Object};

#[derive(Clone, Drop, Serde, Introspect)]
#[dojo::model]
pub struct ParentToChildren {
    #[key]
    pub inst: felt252,
    pub is_parent: bool,
    // properties
    pub children: Array<felt252>,
}

#[derive(Clone, Drop, Serde, Introspect)]
#[dojo::model]
pub struct ChildToParent {
    #[key]
    pub inst: felt252,
    pub is_child: bool,
    // properties
    pub parent: felt252,
}

pub fn hasParent(world: WorldStorage, childKey: felt252) -> bool {
    let child_to_parent: ChildToParent = world.read_model(childKey);
    return child_to_parent.is_child;
}

pub fn getParent(world: WorldStorage, childKey: felt252) -> felt252 {
    let parent: ParentToChildren = world.read_model(childKey);
    if (parent.is_parent) {
        return parent.inst;
    }
    return 0;
}

pub fn getChildrenKeys(world: WorldStorage, parentKey: felt252) -> Array<felt252> {
    let parent_to_children: ParentToChildren = world.read_model(parentKey);
    if (parent_to_children.is_parent) {
        return parent_to_children.children;
    }
    return ArrayTrait::<felt252>::new();
}

pub fn getChildren(world: WorldStorage, parentKey: felt252) -> Array<Object> {
    let mut children: Array<Object> = ArrayTrait::<Object>::new();
    let parent_to_children: ParentToChildren = world.read_model(parentKey);
    if (parent_to_children.is_parent) {
        for childKey in parent_to_children.children {
            let child: Object = world.read_model(childKey);
            children.append(child);
        }
    }
    children
}

pub fn setParent(mut world: WorldStorage, childKey: felt252, parentKey: felt252) {
    // does child already have a parent?
    let mut child_to_parent: ChildToParent = world.read_model(childKey);

    if (hasParent(world, childKey)) {
        removeChildFromParent(world, childKey, child_to_parent.parent);
    }
    addChildToParent(world, childKey, parentKey);
}

pub fn removeChildFromParent(mut world: WorldStorage, childKey: felt252, parentKey: felt252) {
    // does parent have this child
    let mut parent: ParentToChildren = world.read_model(parentKey);
    assert(parent.is_parent, 'Parent is not a parent');
    let mut children: Array<felt252> = ArrayTrait::<felt252>::new();
    assert(children.len() > 0, 'Parent has no children');
    for c in children.clone() {
        if (c != childKey) {
            children.append(c);
        }
    };
    parent.children = children;
    world.write_model(@parent);
    world.write_model(@ChildToParent { inst: childKey, is_child: false, parent: 0 });
}

pub fn addChildToParent(mut world: WorldStorage, childKey: felt252, parentKey: felt252) {
    // does parentKey have this childKey
    let mut parent: ParentToChildren = world.read_model(parentKey);
    let mut children: Array<felt252> = ArrayTrait::<felt252>::new();
    assert(children.len() > 0, 'Parent has no children');
    for c in children.clone() {
        if (c != childKey) {
            children.append(c);
        }
    };
    children.append(childKey);
    parent.children = children;
    parent.is_parent = true;
    world.write_model(@parent);
    world.write_model(@ChildToParent { inst: childKey, is_child: true, parent: parentKey });
}

