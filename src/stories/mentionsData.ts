type MentionObj = {
  name: string,
  link: string,
  avatar: string | null
};

export const initialMentions:MentionObj[] = [
 {
   name: 'gonnza',
   link: '/users/1/gonza',
   avatar: 'https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg'
 },
 {
   name: 'rulo',
   link: '/users/2/rulo',
   avatar: 'https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg'
 },
 {
   name: 'fer',
   link: '/users/3/fer',
   avatar: null
 },
 {
   name: 'pablo',
   link: '/users/4/pablo',
   avatar: null
 },
 {
   name: 'ruloxm',
   link: '/users/5/ruloxm',
   avatar: null
 }];
