const graphql = require('graphql');
const User = require('../models/user');
const Idea = require('../models/idea');

const {
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema, 
    GraphQLID, 
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const IdeaType = new GraphQLObjectType({
    name : 'Idea',
    fields: () =>({
        id: {type: GraphQLString},
        title: {type: GraphQLString},
        body: {type: GraphQLString},
        createdAt: {type: GraphQLString},
        user:{
            type: UserType,
            resolve(parent,args){
                console.log(parent);
                return User.findById(parent.userId);
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name : 'User',
    fields: () =>({
        id: {type: GraphQLString},
        email: {type: GraphQLString},
        password: {type: GraphQLInt},
        createdAt: {type: GraphQLString},
        username: {type: GraphQLString},
        ideas: {
            type: new GraphQLList(IdeaType),
            resolve(parent, args){
                console.log(parent);
                return Idea.find({userId: parent.id});
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        idea: {
            type: IdeaType,
            args: {
                id: {type:GraphQLID}
            },
            resolve(parent,args){
                return Idea.findById(args.id);
            }
        },
        user: {
            type: UserType,
            args: {
                id: {type:GraphQLID}
            },
            resolve(parent,args){
                return User.findById(args.id);
            }
        },
        ideas: {
            type: new GraphQLList(IdeaType),
            resolve(parent, args){
                return Idea.find({});
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args){
                return User.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                username: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                password: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent,args){
                let user = new User({
                    username: args.username,
                    email: args.email,
                    password: args.password,
                    createdAt: new Date().toISOString(),
                });
                return user.save();
            }
        },
        addIdea:{
            type: IdeaType,
            args: {
                title: {type: new GraphQLNonNull(GraphQLString)},
                body: {type: new GraphQLNonNull(GraphQLString)},
                userId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent,args){
                let idea = new Idea({
                    title: args.title,
                    body: args.body,
                    userId: args.userId,
                    createdAt: new Date().toISOString()
                });
                return idea.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});