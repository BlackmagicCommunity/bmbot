export default {
  channels: {
    welcome: '701865087442616380',
    rules: '701865087442616380',
    roles: '701865087442616383',
    logJoins: '712364654877474846',
    logInfractions: '712364674892693534',
    logMessages: '712381454209908777',
    challenges: '764967203714891777',
    challengeWinners: '764990166791094285',
  },
  colors: {
    info: 0x6495ed,
    danger: 0xff0000,
  },
  cronJobs: {
    challengeVoting: '0 17 * * SAT',
    challengeResults: '0 20 * * SUN',
  },
  developers: ['244905301059436545', '131857875973701633', '429983129739067413'], // dave, lucks, tim
  emotes: {
    challengeVote: '765213656681676810',
  },
  messages: {
    rules: '702665704930934835',
    levelUp: "Congratulations %mention%! You're now level %level%.",
    raidKickMessage: 'You have been automatically kicked from Blackmagic Community since the server is in lockdown. Try again later.',
    challengeVoting: 'Voting phase has begun! React with :thumbsup: or :thumbsdown: to your favourite!',
    challengeStart: 'This challenge is titled `%title`. We want stuff that meets the `%topic%` topic\n\n%desc%\n\nRemember - have fun!',
    challengeWinner:
      '**%title%** (%topic%) challenge voting phase has ended and the winner is (drumroll please)....\n\n%mention% with %votes% votes!!!!\nCheck out what they made by clicking on %messageLink%!', // %messageLink% is replaced with [here](url)
    challengeWinners:
      '**%title%** (%topic%) challenge voting phase has ended and we got a... tie!!! The winners are (drumroll please).... \n\n%mentions% with %votes% votes!!!!\nCheck out what they made by clicking on %messageLinks%!', // %messageLinks% is replaced with [Username#discrim](url), [Username#discrim](url2)
  },
  owner: '131857875973701633',
  prefix: '&',
  raid: {
    memberJoinInterval: 10000, // in ms
    okWait: 1200000, // in ms
    memberCount: 10,
    raidVerificationLevel: 'HIGH',
    okVerificationLevel: 'LOW',
  },
  roles: {
    challenge: '764975817280847873',
    private: '761336867223896085',
  },
};
