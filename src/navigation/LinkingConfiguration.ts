import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Login: {
        screens: {
          Login: 'login',
        },
      },
      Root: {
        screens: {
          TabOne: {
            screens: {
              TabOneScreen: 'one',
              Payments: 'payments',
            },
          },
          TabTwo: {
            screens: {
              TabTwoScreen: 'two',
            },
          },
          TabThree: {
            screens: {
              TabTwoScreen: 'three',
            },
          },
        },
      },
      NotFound: '*',
    },
  },
};
