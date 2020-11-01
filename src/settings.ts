export default {
  channels: {
    welcome: '479298119255851029',
    rules: '479298119255851029',
    roles: '701031262558879814',
    logJoins: '715988890359431168',
    logInfractions: '715988890359431168',
    logMessages: '715988890359431168',
    challenges: '770740089721847848',
    challengeWinners: '770740272425861130',
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
    challengeVote: '701042202373259324',
  },
  messages: {
    rules: '624188483308879872',
    levelUp: "Congratulations %mention%! You're now level %level%.\n*You can opt-out of these messages in the roles menue*",
    raidKickMessage: 'You have been automatically kicked from Blackmagic Community since the server is in lockdown. Try again later please.',
    challengeVoting: 'Voting phase has begun! React with :bmd: to your favourite!',
    challengeStart: 'New challenge! `%topic%`\n\n%desc%\n\nYou have time to post your entry till saturday when the voting starts. Have fun!',
    challengeWinner:
      '**%title%** (%topic%) challenge voting phase has ended and the winner is (drumroll please)....\n\n%mention% with %votes% votes!!!!\nCheck out what they made by clicking on %messageLink%!', // %messageLink% is replaced with [here](url)
    challengeWinners:
      '**%title%** (%topic%) challenge voting phase has ended and we got a... tie!!! The winners are (drumroll please).... \n\n%mentions% with %votes% votes!!!!\nCheck out what they made by clicking on %messageLinks%!', // %messageLinks% is replaced with [Username#discrim](url), [Username#discrim](url2)
  },
  owner: '131857875973701633',
  prefixes: ['!','!bmd','!bmd '],
  raid: {
    memberJoinInterval: 10000, // in ms
    okWait: 1200000, // in ms
    memberCount: 10,
    raidVerificationLevel: 'HIGH',
    okVerificationLevel: 'LOW',
  },
  roles: {
    challenge: '770742440490565673',
    private: '770398819447341096',
  },
};
