export default {
  channels: {
    welcome: '479298119255851029', // where the bot sends join messages
    rules: '479298119255851029', // where the bot gets the rules from
    roles: '701031262558879814', // where the bot handles role menu
    logs: '715988890359431168', // where to send logs
    challenges: '770740089721847848', // where to handle challenges
    challengeWinners: '770740272425861130', // where to send challenge winners
    boterrors: '701865087442616381', // where to send bot errors
  },
  colors: {
    info: 0x6495ed,
    danger: 0xff0000,
    warning: 0xffcc00,
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
    rules: '624188483308879872', // rules message id
    levelUp: "Congratulations %mention%! You're now level %level%.\n*You can opt-out of these messages in the roles menu*",
    raidKickMessage: 'You have been automatically kicked from Blackmagic Community since the server is in lockdown. Please try again later.',
    challengeVoting: 'Voting phase has begun! React with <:bmd:701042202373259324> to your favourite!',
    challengeStart:
      "New challenge! It's about `%topic%` and is called **%title%**\n\n%desc%\n\nYou have time to post your entry till saturday when the voting starts. Have fun!",
    challengeWinner:
      '**%title%** (%topic%) challenge voting phase has ended and the winner is (drumroll please)....\n\n%mention% with %votes% votes!!!!\nCheck out what they made by clicking on %messageLink%!', // %messageLink% is replaced with [here](url)
    challengeWinners:
      '**%title%** (%topic%) challenge voting phase has ended and we got a... tie!!! The winners are (drumroll please).... \n\n%mentions% with %votes% votes!!!!\nCheck out what they made by clicking on %messageLinks%!', // %messageLinks% is replaced with [Username#discrim](url), [Username#discrim](url2)
  },
  owner: '429983129739067413',
  prefixes: ['!bmd ', '!bmd', '!'], // must be from "longer" to "shorter"
  raid: {
    memberJoinInterval: 10000, // in ms
    okWait: 1200000, // in ms
    // allow up to memberCount in memberJoinInterval time before activating raid prevention
    memberCount: 10,
    raidVerificationLevel: 'HIGH',
    okVerificationLevel: 'LOW',
  },
  roles: {
    challenge: '770742440490565673', // role to notify users of challenges
    private: '770398819447341096', // role so users no longer get messages from grant
    inverse: ['770742440490565673'], // array of roles to reverse in role menu - reaction add = remove role; reaction remove = add role;
  },
};
