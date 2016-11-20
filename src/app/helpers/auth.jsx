import { ref, firebaseAuth } from '../constants/firebase';

export function requireAuth(nextState, replace) {
    if(null === firebaseAuth().currentUser) {
        replace({
          pathname: '/',
          state: { nextPathname: nextState.location.pathname }
        })
    }
}

export function auth(email, pw) {
  	return firebaseAuth().createUserWithEmailAndPassword(email, pw)
    	.then(saveUser)
    	.catch((error) => console.log('Oops', error))
}

export function login(email, pw) {
  	return firebaseAuth().signInWithEmailAndPassword(email, pw)
}

export function logout() {
  	return firebaseAuth().signOut()
}

export function saveUser(user) {
  	return ref.child(`users/${user.uid}/info`)
    	.set({
      		email: user.email,
      		uid: user.uid
    	})
    	.then(() => user)
}