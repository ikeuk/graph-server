const graphql = require('graphql');
const _=require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');
const { 
	GraphQLObjectType,
	 GraphQLString, 
	 GraphQLSchema,
	 GraphQLID,
	 GraphQLInt,
	 GraphQLList,
	 GraphQLNonNull
} = graphql;

// var books = [
// 	{name: 'Name of the Wind', genre: 'Fantasy', id:'1', authorid:'1'},
// 	{name: 'Captain Mercy', genre: 'Fantasy the same author', id:'4', authorid:'1'},
// 	{name: 'Name fanal Empire', genre: 'Fantasy', id:'2', authorid:'2'},
// 	{name: 'Name Long Earth', genre: 'Sci-Fi', id:'3', authorid:'3'},

// ];
// var authors = [
// 	{name: 'Patrick Rothfuss', age:44, id:'1'},
// 	{name: 'David Gasner', age:60, id:'2'},
// 	{name: 'Ikey Peters', age:30, id:'3'},
// ];

const BookType = new GraphQLObjectType({
	name: 'Book',
	fields:() => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		genre: { type: GraphQLString },
		//Note by adding this code the relationship can now be binded with Book/Author
		//What about author/Books witten by them
		author:{
			type: AuthorType,
			resolve(parent,args){
				//return _.find(authors,{id:parent.authorid});
				//Now to access the book with authorid we have to reference the author imported at the top
			return Author.findById(parent.authorid);
			}
		}
	}) 
});

const AuthorType = new GraphQLObjectType({
	name: 'Author',
	fields:() => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
			//here we are quering books from the AuthorType so as to enable the relationship
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args){
				//return _.filter(books, {authorid: parent.id});
				//the same goes here we are using book model impoted at the top
				return Book.find({authorid: parent.id});
			}
		}
	}) 
});
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields:{
		book:{
			type:BookType,
			args:{id: {type:GraphQLID}},
			resolve(parent, args){
				//code to get data from db /other source
				//return _.find(books,{id:args.id});
				return Book.findById(args.id);
			}
		},

		author:{
			type:AuthorType,
			args:{id: {type:GraphQLID}},
			resolve(parent, args){
				//code to get data from db /other source
				//return _.find(authors,{id:args.id});
				return Author.findById(args.id);
			}
		},
		//This is going to be a query for listing of all the books
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args){
				//return books;
				return Book.find({});
			}
		},
		//Doing the same thing for all authors
		authors: {
			type: new GraphQLList(AuthorType),
			resolve(parent, args){
				//return authors;
				return Author.find({});
			}
		}
	}
}); 

//Mutations For Authors
const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields:{
		addAuthor:{
			type:AuthorType,
			args:{
				name:{type:new GraphQLNonNull(GraphQLString)},
				age:{type:new GraphQLNonNull(GraphQLInt)}
			},
			resolve(parent,args){
				//Author model imported at the top
				let author = new Author({
					name:args.name,
					age: args.age
				});
				return author.save();
			}
		},

		//mutation for Books
		addBook:{
			type:BookType,
			args:{
				name:{type:new GraphQLNonNull(GraphQLString)},
				genre:{type:new GraphQLNonNull(GraphQLString)},
				authorid:{type:new GraphQLNonNull(GraphQLID)}
			},
			resolve(parent,args){
				//remember here we imported book models at the top so we use it now.
				let book = new Book({
					name: args.name,
					genre: args.genre,
					authorid: args.authorid
				});
				return book.save();
			}
		}
	}
});

module.exports=new GraphQLSchema({
	query: RootQuery,
	mutation:Mutation
});