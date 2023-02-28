const {User, Quiz} = require("./model.js").models;

exports.help = (rl) => 
  rl.log(
    `  Commands (params are requested after):
    > h              ## show help
    >
    > lu | ul | u    ## users: list all
    > cu | uc        ## user: create
    > ru | ur | r    ## user: read (show age)
    > uu             ## user: update
    > du | ud        ## user: delete
    >
    > lq | ql | q    ## quizzes: list all
    > cq | qc        ## quiz: create
    > tq | qt | t    ## quiz: test (play)
    > uq | qu        ## quiz: update
    > dq | qd        ## quiz: delete
    >
    > lf | fl | f    ## favourites: list all
    > cf | fc        ## favourite: create
    > df | fd        ## favourite: delete
    >
    >
    > p              ## play
    >
    > ls              ## list score

    > e              ## exit & return to shell`
  )

// Show all users in DB
exports.list = async (rl) => {

  let users = await User.findAll();
  
  users.forEach( u => rl.log(`  ${u.name} is ${u.age} years old\n`));
}

// Create user with age in the DB
exports.create = async (rl) => {

  let name = await rl.questionP("Enter name");
  if (!name) throw new Error("Response can't be empty!\n");

  let age = await rl.questionP("Enter age");
  if (!age) throw new Error("Response can't be empty!\n");

  await User.create( 
    { name, age }
  );
  rl.log(`   ${name} created with ${age} years\n`);
}

// Show user's age, quizzes & favourites
exports.read = async (rl) => {

  let name = await rl.questionP("Enter name");

  if (!name) throw new Error("Response can't be empty!\n");

  let user = await User.findOne({
    where: {name},
    include: [
      { model: Quiz, as: 'posts'},
      { model: Quiz, as: 'fav',
        include: [{ model: User, as: 'author'}]
      }
    ]
});

if (!user) throw new Error(`  '${name}' is not in DB\n`);

  rl.log(`  ${user.name} is ${user.age} years old\n`);

  rl.log(`    Quizzes:\n`)
  user.posts.forEach(
    (quiz) => rl.log(`      ${quiz.question} -> ${quiz.answer} (${quiz.id})\n`)
  );

  rl.log(`    Favourite quizzes:\n`)
  user.fav.forEach( (quiz) => 
    rl.log(`      ${quiz.question} -> ${quiz.answer} (${quiz.author.name}, ${quiz.id})\n`)
  );
}

// Update the user (identified by name) in the DB
exports.update = async (rl) => {

  let old_name = await rl.questionP("Enter name to update");

  if (!old_name) throw new Error("Response can't be empty!\n");

  let name = await rl.questionP("Enter new name");
  if (!name) throw new Error("Response can't be empty!\n");

  let age = await rl.questionP("Enter new age");
  if (!age) throw new Error("Response can't be empty!\n");

  let n = await User.update(
    {name, age}, 
    {where: {name: old_name}}
  );

  if (n[0]===0) throw new Error(`  ${old_name} not in DB\n`);

  rl.log(`  ${old_name} updated to ${name}, ${age}\n`);
}

// Delete user & his quizzes/favourites (relation: onDelete: 'cascade')
exports.delete = async (rl) => {

  let name = await rl.questionP("Enter name");

  if (!name) throw new Error("Response can't be empty!\n");

  let n = await User.destroy(
    { where: {name}}
  );

  if (n===0) throw new Error(`User ${name} not in DB\n`);

  rl.log(`  ${name} deleted from DB\n`);  
}

