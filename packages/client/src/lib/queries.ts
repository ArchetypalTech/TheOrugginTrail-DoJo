import { graphql } from "$houdini";

export const updates = graphql(`
  subscription Event {
    eventEmitted {
      id
      keys
    }
  }
`);

export const torii_gql = graphql(`
  subscription EntityModel($id: ID!) {
    entityUpdated(id: $id) {
      id
      keys
      models {
        __typename,
        ... on the_oruggin_trail_Output {
          text_o_vision
        }
      }
    }
  }
`);
