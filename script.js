const DEBUG_RESULTS_ONLY = false;
window.addEventListener("DOMContentLoaded", () => {
  const savedAnswers = localStorage.getItem("quizAnswers");
  if (savedAnswers) {
    userAnswers = JSON.parse(savedAnswers);
    calculateResults(); // ✅ Recalculate similarity
    document.getElementById("start-screen").style.display = "none";
  }

  const retakeBtn = document.getElementById("retakeBtn");
  if (retakeBtn) {
    retakeBtn.addEventListener("click", () => {
      localStorage.removeItem("quizAnswers");
      location.reload();
    });
  }
});



const questionBank = {
  "Motivation": [
    "You’re passed over for a promotion. How likely are you to work even harder afterward?",
    "You face multiple failures in a row. How likely are you to keep giving your best?",
    "You’re given a once-in-a-lifetime opportunity. How likely are you to take it boldly?",
    "You lose motivation. How likely are you to actively seek inspiration again?",
    "You hit a plateau in life. How likely are you to push yourself to the next level?",
    "Your dream seems far away. How likely are you to continue pursuing it daily?",
    "You're surrounded by discouraging people. How likely are you to remain driven?",
    "You're asked to lead a risky but high-impact project. How likely are you to accept it?",
    "You fail publicly. How likely are you to try again the next day?",
    "You don’t see immediate results. How likely are you to keep putting in effort?",
    "You're working on a long-term goal. How likely are you to maintain enthusiasm over time?",
    "You're burnt out. How likely are you to recover and continue progressing?",
    "You have multiple options. How likely are you to choose the one that challenges you most?",
    "You’re behind your peers. How likely are you to keep working at your pace?",
    "You're told your dream is unrealistic. How likely are you to prove them wrong?",
    "You feel stagnant. How likely are you to set a new bold goal for yourself?",
    "You hear of someone else achieving your dream. How likely are you to take action yourself?",
    "You’re asked what drives you. How likely are you to give a passionate answer?",
    "You have to restart something you failed at. How likely are you to begin again?",
    "You’re alone in your pursuit. How likely are you to stay committed?"
  ],
  "Compassion": [
    "You see someone crying in public. How likely are you to check if they’re okay?",
    "A homeless person asks you for food. How likely are you to help them out?",
    "You witness a classmate being bullied. How likely are you to step in kindly?",
    "A friend vents for an hour. How likely are you to listen patiently without interrupting?",
    "A colleague is overwhelmed. How likely are you to offer to lighten their workload?",
    "You notice someone withdrawn in a group. How likely are you to include them?",
    "You hear someone had a bad day. How likely are you to follow up with concern?",
    "You pass by a hurt animal. How likely are you to stop and help it?",
    "You learn a peer is grieving. How likely are you to check in on them regularly?",
    "Someone makes a mistake. How likely are you to respond with understanding?",
    "You see someone drop their groceries. How likely are you to rush and help?",
    "You read about a disaster in another country. How likely are you to donate or support?",
    "A child is lost in a mall. How likely are you to stay and help them find a parent?",
    "You hear someone being spoken to rudely. How likely are you to gently defend them?",
    "A friend is embarrassed. How likely are you to help them feel okay again?",
    "You know someone is in need. How likely are you to offer help before they ask?",
    "A stranger asks for directions. How likely are you to guide them kindly?",
    "Someone’s carrying too many bags. How likely are you to hold the door for them?",
    "You’re thanked by someone emotional. How likely are you to respond compassionately?",
    "You hear someone’s feeling invisible. How likely are you to acknowledge them warmly?"
  ],
  "Wit": [
    "You're put on the spot in a tense meeting. How likely are you to ease it with humor?",
    "You forget your speech mid-sentence. How likely are you to recover with a clever line?",
    "Someone makes fun of you. How likely are you to joke back smartly?",
    "You’re caught in a contradiction. How likely are you to charm your way through it?",
    "You’re asked a tough question publicly. How likely are you to respond wittily?",
    "An awkward silence hits a room. How likely are you to break it with a funny comment?",
    "A date is going badly. How likely are you to turn it around with humor?",
    "Your friends are low-energy. How likely are you to lift the mood playfully?",
    "You hear a bad joke. How likely are you to make it better with timing?",
    "You’re presenting. How likely are you to add light humor for engagement?",
    "You spill your coffee at a meeting. How likely are you to laugh and keep going?",
    "You fumble your intro. How likely are you to recover with charm?",
    "You’re roasted by a friend. How likely are you to respond cleverly?",
    "You're arguing. How likely are you to disarm it with humor?",
    "You see someone nervous. How likely are you to comfort them with a joke?",
    "You meet a celebrity. How likely are you to make a memorable, witty comment?",
    "Your boss teases you. How likely are you to banter back appropriately?",
    "You're the quiet one in the group. How likely are you to drop a surprising funny line?",
    "You're given a mic at a party. How likely are you to entertain briefly?",
    "A kid tells you a weird joke. How likely are you to play along humorously?"
  ],
  "Consistency": [
    "You're given a long-term task. How likely are you to follow through without reminders?",
    "You make a promise. How likely are you to keep it no matter what?",
    "You’re trying to build a habit. How likely are you to stick to it daily?",
    "You're working out. How likely are you to maintain your schedule consistently?",
    "You're told a secret. How likely are you to keep it for years?",
    "You're trusted with responsibility. How likely are you to handle it the same way every time?",
    "You commit to a goal. How likely are you to push forward every week?",
    "You’re writing a journal. How likely are you to maintain it every day?",
    "You’re on a team project. How likely are you to deliver your part reliably?",
    "You volunteer for something. How likely are you to show up on time each time?",
    "You agree to a schedule. How likely are you to follow it precisely?",
    "You're given strict rules. How likely are you to maintain discipline?",
    "You're tracking a new skill. How likely are you to practice without skipping days?",
    "You're learning a language. How likely are you to study daily for months?",
    "You're asked for a weekly update. How likely are you to submit it on time always?",
    "You begin a challenge. How likely are you to complete every step as planned?",
    "You promise to mentor someone. How likely are you to show up every session?",
    "You aim to be dependable. How likely are you to check your consistency?",
    "You agree to a daily meditation. How likely are you to stay regular for a year?",
    "You miss a day. How likely are you to get back on track the next day?"
  ],
  "Loyalty": [
    "A friend moves far away. How likely are you to stay in regular touch?",
    "Your sibling is in trouble. How likely are you to be by their side?",
    "Someone criticizes your group. How likely are you to defend them?",
    "Your friend makes a mistake. How likely are you to stand by them supportively?",
    "You’re asked to betray a friend for gain. How likely are you to say no?",
    "You're offered a better deal elsewhere. How likely are you to stay with your team?",
    "Your teammate is blamed unfairly. How likely are you to speak up for them?",
    "You’re pressured to switch sides. How likely are you to remain loyal?",
    "You’re tempted with money. How likely are you to prioritize loyalty over it?",
    "Your friend is mocked when not present. How likely are you to defend them?",
    "Your team is losing. How likely are you to continue supporting them publicly?",
    "You’re asked to keep a promise to a friend. How likely are you to honor it fully?",
    "You find out someone’s cheating your friend. How likely are you to inform them?",
    "You're trusted with private info. How likely are you to keep it secret?",
    "You see a friend being backstabbed. How likely are you to protect them?",
    "Your family is being insulted. How likely are you to stand up respectfully?",
    "You disagree with your group. How likely are you to still represent them honestly?",
    "You’re thanked for your loyalty. How likely are you to repeat that behavior?",
    "You're offered fame to betray your mentor. How likely are you to turn it down?",
    "You and your friend are punished. How likely are you to share the blame?"
  ],
  "Self-Awareness": [
    "You overreact to a situation. How likely are you to reflect on why?",
    "You interrupt someone. How likely are you to notice and correct it?",
    "You hurt someone unintentionally. How likely are you to acknowledge your role?",
    "You win an argument. How likely are you to consider their side too?",
    "You're praised. How likely are you to analyze if it’s truly deserved?",
    "You're feeling anxious. How likely are you to sit and examine your thoughts?",
    "You have a bad habit. How likely are you to try and understand its cause?",
    "You fail a task. How likely are you to assess your decisions honestly?",
    "You're told you're wrong. How likely are you to reflect instead of defending?",
    "You're criticized. How likely are you to look for valid parts in it?",
    "You’re in conflict. How likely are you to explore your own triggers?",
    "You make a poor choice. How likely are you to reflect instead of blaming?",
    "You’re experiencing jealousy. How likely are you to understand its root?",
    "You succeed unexpectedly. How likely are you to evaluate what worked?",
    "You’re complimented. How likely are you to stay grounded and honest?",
    "You hurt someone with words. How likely are you to think about what led to it?",
    "You’re celebrated. How likely are you to reflect on your values anyway?",
    "You feel superior. How likely are you to question your assumptions?",
    "You lose your temper. How likely are you to analyze it afterward?",
    "You get negative feedback. How likely are you to examine it openly?"
  ],
  "Courage": [
    "You witness an injustice at work. How likely are you to speak up, even if it risks your reputation?",
    "You’re offered a chance to try something new but intimidating. How likely are you to dive in despite your fears?",
    "You face a sudden emergency. How likely are you to take charge and act decisively?",
    "You’re asked to defend an unpopular opinion you believe in. How likely are you to stand your ground?",
    "You discover a mistake that could harm your team. How likely are you to admit it publicly and fix it?",
    "You’re in a high-stakes situation with no clear path. How likely are you to trust your instincts and act?",
    "Someone challenges your core values. How likely are you to confront them calmly but firmly?",
    "You’re given a chance to lead in a crisis. How likely are you to step up without hesitation?",
    "You’re scared of failing at a public event. How likely are you to perform anyway and give it your all?",
    "You’re asked to take a stand for someone vulnerable. How likely are you to act despite pushback?",
    "You face a personal fear head-on. How likely are you to push through and overcome it?",
    "You’re in a risky situation with uncertain outcomes. How likely are you to take action anyway?",
    "You’re offered a role that feels beyond your skills. How likely are you to accept it and learn fast?",
    "You see a chance to make a bold career move. How likely are you to seize it despite the risks?",
    "You’re pressured to stay silent about a wrong. How likely are you to speak out regardless?",
    "You’re asked to take responsibility for a failure. How likely are you to own it courageously?",
    "You face a daunting physical challenge. How likely are you to tackle it with determination?",
    "You’re in a conflict with someone intimidating. How likely are you to address it directly?",
    "You have an opportunity to share a bold idea. How likely are you to present it confidently?",
    "You’re scared but see someone in danger. How likely are you to intervene to help?"
  ],
  "Vulnerability": [
    "You’re struggling with a personal issue. How likely are you to share it with a trusted friend?",
    "You make a mistake at work. How likely are you to admit it openly to your team?",
    "You’re feeling overwhelmed. How likely are you to ask for help without shame?",
    "You’re in a deep conversation. How likely are you to share a personal insecurity?",
    "You’ve hurt someone close. How likely are you to apologize sincerely and openly?",
    "You’re unsure about a decision. How likely are you to express your doubts to others?",
    "You’re emotional in a tough moment. How likely are you to let others see your feelings?",
    "You’re asked about a past failure. How likely are you to share it honestly?",
    "You’re in a new group. How likely are you to open up about your true self?",
    "You’re scared of being judged. How likely are you to share your authentic thoughts anyway?",
    "You’re feeling vulnerable after a setback. How likely are you to talk about it with someone?",
    "You’re in a relationship discussion. How likely are you to express your true emotions?",
    "You’re asked about your fears. How likely are you to answer candidly?",
    "You’re struggling with self-doubt. How likely are you to seek support openly?",
    "You’re in a moment of weakness. How likely are you to let someone help you through it?",
    "You’re given feedback that stings. How likely are you to admit it resonates with you?",
    "You’re in a group sharing stories. How likely are you to share a personal challenge?",
    "You’re feeling disconnected. How likely are you to reach out and be vulnerable?",
    "You’re asked about your dreams. How likely are you to share them, even if they’re big?",
    "You’re in a tough spot emotionally. How likely are you to let someone in to support you?"
  ],
  "Relatability": [
    "You meet someone new. How likely are you to find common ground to connect with them?",
    "You’re in a group with diverse people. How likely are you to share a relatable story?",
    "Someone shares a struggle. How likely are you to empathize by sharing a similar experience?",
    "You’re leading a team. How likely are you to connect by showing you’ve faced similar challenges?",
    "You’re at a social event. How likely are you to make others feel included with relatable banter?",
    "Someone feels out of place. How likely are you to make them feel understood with a shared experience?",
    "You’re mentoring someone. How likely are you to share relatable lessons from your past?",
    "You’re in a heated debate. How likely are you to find a relatable point to ease tension?",
    "You’re speaking publicly. How likely are you to use relatable anecdotes to engage the audience?",
    "You meet someone from a different background. How likely are you to connect over shared values?",
    "You’re comforting a friend. How likely are you to relate to their feelings with your own story?",
    "You’re in a new environment. How likely are you to bond by sharing a universal experience?",
    "Someone feels misunderstood. How likely are you to make them feel seen with a relatable comment?",
    "You’re teaching a group. How likely are you to use relatable examples to clarify ideas?",
    "You’re in a casual chat. How likely are you to share a relatable quirk to build rapport?",
    "You’re working with a shy colleague. How likely are you to connect through a shared interest?",
    "You’re at a family gathering. How likely are you to bond over shared memories or humor?",
    "You’re in a conflict. How likely are you to find a relatable perspective to bridge the gap?",
    "You’re meeting a client. How likely are you to build trust with a relatable story?",
    "You’re in a group discussion. How likely are you to share a relatable insight to unite everyone?"
  ],
  "Flaws": [
    "You realize you’ve been too stubborn. How likely are you to admit it and adjust?",
    "You interrupt someone by mistake. How likely are you to apologize and correct it?",
    "You procrastinated on a task. How likely are you to own it and make it right?",
    "You misjudge someone’s intentions. How likely are you to acknowledge your error?",
    "You’re overly critical in a discussion. How likely are you to recognize and soften your tone?",
    "You miss a deadline. How likely are you to take responsibility without excuses?",
    "You react impulsively. How likely are you to reflect and address your mistake?",
    "You’re impatient with a colleague. How likely are you to admit it and make amends?",
    "You overlook someone’s effort. How likely are you to recognize and thank them later?",
    "You’re too focused on perfection. How likely are you to accept it and move forward?",
    "You snap at a friend. How likely are you to own your mood and apologize?",
    "You’re disorganized and it causes issues. How likely are you to admit it and improve?",
    "You misread a situation. How likely are you to own up and learn from it?",
    "You’re overly competitive. How likely are you to notice and balance your approach?",
    "You forget an important detail. How likely are you to admit it and fix the oversight?",
    "You’re too hard on yourself. How likely are you to recognize it and seek balance?",
    "You dominate a conversation. How likely are you to step back and give others space?",
    "You make an unfair assumption. How likely are you to correct it and apologize?",
    "You’re distracted during a key moment. How likely are you to own it and refocus?",
    "You let stress affect your behavior. How likely are you to acknowledge and address it?"
  ],
  "Resilience": [
    "You face a major setback at work. How likely are you to bounce back and keep going?",
    "You lose something important to you. How likely are you to find strength and move forward?",
    "You’re rejected for an opportunity. How likely are you to try again with optimism?",
    "You’re criticized harshly. How likely are you to learn from it and keep pushing?",
    "You experience a personal loss. How likely are you to find ways to heal and continue?",
    "You fail at a big goal. How likely are you to regroup and set a new one?",
    "You’re physically exhausted. How likely are you to rest and come back stronger?",
    "You’re emotionally drained. How likely are you to seek support and recover?",
    "You’re stuck in a tough situation. How likely are you to find a way to persevere?",
    "You face repeated obstacles. How likely are you to stay determined and keep trying?",
    "You’re overwhelmed by stress. How likely are you to adapt and keep moving forward?",
    "You lose confidence after a mistake. How likely are you to rebuild it and try again?",
    "You’re in a prolonged struggle. How likely are you to stay resilient and not give up?",
    "You’re doubted by others. How likely are you to prove your strength by continuing?",
    "You’re hit with unexpected bad news. How likely are you to process it and keep going?",
    "You’re in a low moment. How likely are you to find motivation to rise again?",
    "You face financial hardship. How likely are you to stay focused and work through it?",
    "You’re burned out from effort. How likely are you to recharge and restart?",
    "You’re discouraged by slow progress. How likely are you to stay committed anyway?",
    "You’re knocked down by failure. How likely are you to get up and try again?"
  ],
  "Charisma": [
    "You enter a room full of strangers. How likely are you to charm them with your presence?",
    "You’re giving a presentation. How likely are you to captivate the audience effortlessly?",
    "You meet a new colleague. How likely are you to make them feel instantly at ease?",
    "You’re at a networking event. How likely are you to draw people in with your energy?",
    "You’re telling a story. How likely are you to make it engaging and memorable?",
    "You’re in a group discussion. How likely are you to shine with confidence and warmth?",
    "You’re leading a meeting. How likely are you to inspire others with your enthusiasm?",
    "You’re at a social gathering. How likely are you to be the one people gravitate toward?",
    "You’re pitching an idea. How likely are you to persuade others with your charisma?",
    "You’re calming a tense situation. How likely are you to use charm to diffuse it?",
    "You’re meeting someone influential. How likely are you to leave a lasting impression?",
    "You’re in a casual chat. How likely are you to make everyone feel connected?",
    "You’re motivating a team. How likely are you to rally them with your energy?",
    "You’re at a party. How likely are you to light up the room with your presence?",
    "You’re sharing a vision. How likely are you to inspire others with your passion?",
    "You’re in a tough conversation. How likely are you to win people over with tact?",
    "You’re introducing yourself. How likely are you to make it warm and memorable?",
    "You’re speaking to a crowd. How likely are you to hold their attention effortlessly?",
    "You’re collaborating on a project. How likely are you to energize the group?",
    "You’re in a quiet moment. How likely are you to spark connection with your charm?"
  ],
  "Humor": [
    "You’re in a dull meeting. How likely are you to lighten the mood with a clever joke?",
    "You trip in front of others. How likely are you to laugh it off with a witty comment?",
    "You’re with a nervous group. How likely are you to ease tension with humor?",
    "You’re teased playfully. How likely are you to respond with a funny comeback?",
    "You’re telling a story. How likely are you to add humor to make it more engaging?",
    "You’re in an awkward moment. How likely are you to break the ice with a joke?",
    "You’re leading a team. How likely are you to use humor to boost morale?",
    "You’re at a family dinner. How likely are you to get everyone laughing?",
    "You’re giving a speech. How likely are you to sprinkle in humor to connect?",
    "You’re with a quiet crowd. How likely are you to spark laughter with a quip?",
    "You’re in a tense argument. How likely are you to diffuse it with light humor?",
    "You’re meeting new people. How likely are you to use humor to build rapport?",
    "You’re sharing a mistake. How likely are you to frame it with self-deprecating humor?",
    "You’re in a boring conversation. How likely are you to steer it with a funny twist?",
    "You’re cheering up a friend. How likely are you to use humor to lift their spirits?",
    "You’re in a playful debate. How likely are you to toss in a witty remark?",
    "You’re at a social event. How likely are you to entertain with a funny story?",
    "You’re working with kids. How likely are you to make them giggle with humor?",
    "You’re in a serious moment. How likely are you to use humor appropriately to ease it?",
    "You’re feeling low. How likely are you to use humor to brighten your own mood?"
  ],
  "Resourcefulness": [
    "You’re short on supplies for a project. How likely are you to find a creative workaround?",
    "You’re stuck without a tool you need. How likely are you to improvise effectively?",
    "You face a sudden obstacle at work. How likely are you to find an innovative solution?",
    "You’re given limited resources. How likely are you to make the most of what you have?",
    "You’re in a new city without a plan. How likely are you to figure things out quickly?",
    "You’re tasked with something unfamiliar. How likely are you to learn and adapt fast?",
    "You’re in a crisis with no clear answer. How likely are you to find a practical fix?",
    "You’re short on time for a deadline. How likely are you to prioritize and deliver?",
    "You’re helping a friend in need. How likely are you to find resources to support them?",
    "You’re lost in an unfamiliar place. How likely are you to navigate your way out?",
    "You’re given a vague task. How likely are you to clarify it and get it done?",
    "You’re in a group with no leader. How likely are you to step up with a plan?",
    "You’re facing a technical issue. How likely are you to troubleshoot it yourself?",
    "You’re planning an event on a budget. How likely are you to make it work creatively?",
    "You’re out of options in a debate. How likely are you to find a fresh perspective?",
    "You’re mentoring someone stuck. How likely are you to guide them to a solution?",
    "You’re in a survival scenario. How likely are you to use what’s around you wisely?",
    "You’re tasked with a complex problem. How likely are you to break it down and solve it?",
    "You’re short-staffed on a project. How likely are you to rally and get it done?",
    "You’re in a pinch financially. How likely are you to find a clever way to manage?"
  ],
  "Authenticity": [
    "You’re pressured to act unlike yourself. How likely are you to stay true to your values?",
    "You’re in a group with different opinions. How likely are you to speak your truth?",
    "You’re offered a role that doesn’t align with you. How likely are you to decline it?",
    "You’re tempted to exaggerate a story. How likely are you to keep it real instead?",
    "You’re in a superficial conversation. How likely are you to steer it to something genuine?",
    "You’re asked about your beliefs. How likely are you to answer honestly, no matter what?",
    "You’re in a competitive environment. How likely are you to stay authentic under pressure?",
    "You’re praised for something you didn’t do. How likely are you to correct the record?",
    "You’re in a new social circle. How likely are you to show your true personality?",
    "You’re tempted to hide a flaw. How likely are you to own it openly instead?",
    "You’re in a heated moment. How likely are you to respond with your true feelings?",
    "You’re asked to compromise your principles. How likely are you to stand firm?",
    "You’re in a formal setting. How likely are you to keep your unique voice?",
    "You’re sharing your goals. How likely are you to express your real aspirations?",
    "You’re criticized for being yourself. How likely are you to stay authentic anyway?",
    "You’re in a group project. How likely are you to contribute in your own way?",
    "You’re tempted to follow a trend. How likely are you to stick to what feels right?",
    "You’re in a vulnerable moment. How likely are you to show your true self?",
    "You’re asked about your past. How likely are you to share it without embellishment?",
    "You’re in a leadership role. How likely are you to lead with your authentic style?"
  ],
  "Influence on Others": [
    "You’re pitching a new idea. How likely are you to inspire others to support it?",
    "You’re leading a hesitant team. How likely are you to motivate them to act?",
    "You’re sharing a vision. How likely are you to get others excited to join you?",
    "You’re in a debate. How likely are you to sway others with your perspective?",
    "You’re mentoring someone. How likely are you to inspire them to grow?",
    "You’re in a group discussion. How likely are you to guide it toward a solution?",
    "You’re calming a conflict. How likely are you to influence a peaceful outcome?",
    "You’re at misinformation event. How likely are you to rally others for a cause?",
    "You’re teaching a skill. How likely are you to inspire confidence in others?",
    "You’re sharing a personal story. How likely are you to move others emotionally?",
    "You’re in a tough negotiation. How likely are you to persuade others effectively?",
    "You’re leading a volunteer effort. How likely are you to inspire consistent participation?",
    "You’re presenting to skeptics. How likely are you to win them over with your passion?",
    "You’re in a casual chat. How likely are you to influence someone’s perspective subtly?",
    "You’re advocating for change. How likely are you to get others to act with you?",
    "You’re comforting someone upset. How likely are you to lift their spirits positively?",
    "You’re in a brainstorming session. How likely are you to spark others’ creativity?",
    "You’re sharing feedback. How likely are you to inspire someone to improve?",
    "You’re at a social gathering. How likely are you to influence the group’s mood?",
    "You’re working on a cause. How likely are you to inspire others to join in?"
  ],
  "Dark Side": [
    "You’re tempted to take credit for someone’s work. How likely are you to resist and give credit?",
    "You’re angry and want to lash out. How likely are you to pause and stay fair?",
    "You’re jealous of someone’s success. How likely are you to channel it into motivation?",
    "You’re tempted to gossip. How likely are you to stop and keep it kind instead?",
    "You’re in a power struggle. How likely are you to avoid manipulating others?",
    "You’re frustrated and could snap. How likely are you to control your temper?",
    "You’re tempted to cut corners. How likely are you to stick to your integrity?",
    "You’re holding a grudge. How likely are you to let it go and move forward?",
    "You’re in a competitive moment. How likely are you to avoid being ruthless?",
    "You’re tempted to lie for gain. How likely are you to choose honesty instead?",
    "You’re feeling spiteful. How likely are you to reflect and act with kindness?",
    "You’re in a heated argument. How likely are you to avoid saying something cruel?",
    "You’re tempted to ignore someone’s feelings. How likely are you to show empathy?",
    "You’re annoyed and could be passive-aggressive. How likely are you to address it directly?",
    "You’re tempted to exclude someone. How likely are you to include them instead?",
    "You’re in a moment of pride. How likely are you to stay humble and grounded?",
    "You’re tempted to bend the truth. How likely are you to stick to what’s real?",
    "You’re feeling vengeful. How likely are you to choose forgiveness instead?",
    "You’re in a selfish mood. How likely are you to prioritize others’ needs?",
    "You’re tempted to judge someone harshly. How likely are you to seek understanding?"
  ],
  "Story": [
    "You’re asked about your life’s journey. How likely are you to share a meaningful story?",
    "You’re inspiring a group. How likely are you to use a personal story to connect?",
    "You’re mentoring someone young. How likely are you to share a defining moment?",
    "You’re at a family gathering. How likely are you to tell a story that bonds everyone?",
    "You’re speaking publicly. How likely are you to weave in a personal anecdote?",
    "You’re comforting a friend. How likely are you to share a story that resonates?",
    "You’re in a job interview. How likely are you to tell a story that highlights your values?",
    "You’re teaching a lesson. How likely are you to use a story to make it memorable?",
    "You’re in a reflective moment. How likely are you to share a story of growth?",
    "You’re bonding with a stranger. How likely are you to share a relatable story?",
    "You’re leading a team. How likely are you to share a story to inspire action?",
    "You’re at a reunion. How likely are you to tell a story that sparks nostalgia?",
    "You’re in a creative project. How likely are you to contribute a unique story?",
    "You’re consoling someone. How likely are you to share a story of overcoming hardship?",
    "You’re in a cultural exchange. How likely are you to share a story from your roots?",
    "You’re motivating a group. How likely are you to tell a story of perseverance?",
    "You’re in a casual chat. How likely are you to share a story that entertains?",
    "You’re reflecting on your past. How likely are you to find a story worth sharing?",
    "You’re inspiring a child. How likely are you to tell a story that sparks their imagination?",
    "You’re at a storytelling event. How likely are you to share a heartfelt personal tale?"
  ]
};


let allCharacters = [];
let flatQuestions = [];
let userAnswers = [];
let currentQuestionIndex = 0;
let allSimilarities = [];

fetch('Characterratings.json')
  .then(res => res.json())
  .then(data => {
    allCharacters = data;
  });

function flattenQuestions() {
  flatQuestions = [];
  Object.entries(questionBank).forEach(([trait, list]) => {
    const selected = list.sort(() => 0.5 - Math.random()).slice(0, 2);
    selected.forEach(q => flatQuestions.push({ text: q, trait }));
  });
  userAnswers = new Array(flatQuestions.length).fill(null);
}

function showQuestion(index) {
  const question = flatQuestions[index];
  const area = document.getElementById("question-area");

  area.innerHTML = `
    <div class="question-block">
      <p class="qnum">Question ${index + 1} of ${flatQuestions.length}</p>
      <p class="qtext">${question.text}</p>
      <div class="options stylish-options">
        <label class="option-card"><input type="radio" name="response" value="100"> Very Likely</label>
        <label class="option-card"><input type="radio" name="response" value="80"> Likely</label>
        <label class="option-card"><input type="radio" name="response" value="60"> Neutral</label>
        <label class="option-card"><input type="radio" name="response" value="40"> Unlikely</label>
        <label class="option-card"><input type="radio" name="response" value="20"> Very Unlikely</label>
      </div>
    </div>
  `;

  if (userAnswers[index] !== null) {
    const prev = area.querySelector(`input[value="${userAnswers[index]}"]`);
    if (prev) prev.checked = true;
  }

  document.getElementById("backBtn").style.display = index === 0 ? "none" : "inline-block";
  document.getElementById("nextBtn").style.display = index < flatQuestions.length - 1 ? "inline-block" : "none";
  document.getElementById("submitBtn").style.display = index === flatQuestions.length - 1 ? "inline-block" : "none";
}


function saveAnswer() {
  const selected = document.querySelector(`input[name="response"]:checked`);
  if (!selected) {
    alert("Please answer before proceeding.");
    return false;
  }
  userAnswers[currentQuestionIndex] = parseInt(selected.value);
  return true;
}

document.getElementById("startBtn").onclick = () => {
  flattenQuestions();
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";
  showQuestion(currentQuestionIndex);
};

document.getElementById("nextBtn").onclick = () => {
  if (saveAnswer() && currentQuestionIndex < flatQuestions.length - 1) {
    currentQuestionIndex++;
    showQuestion(currentQuestionIndex);
  }
};

document.getElementById("backBtn").onclick = () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion(currentQuestionIndex);
  }
};

document.getElementById("submitBtn").onclick = () => {
  if (!saveAnswer()) return;
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("search-controls").style.display = "block";
  calculateResults();
};

function softJaccardSimilarity(user, character) {
  let total = 0;

  for (let i = 0; i < user.length; i++) {
    const diff = Math.abs(user[i] - character[i]);

    if (diff <10) total += 1;
    else if (diff < 20) total += 0.9;
    else if (diff < 30) total += 0.8;
    else if (diff < 40) total += 0.7;
    else if (diff < 50) total += 0.6;
    else if (diff < 60) total += 0.5;
    else if (diff < 70) total += 0.4;
    else if (diff < 80) total += 0.3;
    else if (diff < 90) total += 0.2;
    else total += 0;
  }

  return (total / user.length) * 100;
}


function calculateResults() {
  const traitScores = {}, traitCounts = {};

  flatQuestions.forEach((q, i) => {
    if (userAnswers[i] != null) {
      traitScores[q.trait] = (traitScores[q.trait] || 0) + userAnswers[i];
      traitCounts[q.trait] = (traitCounts[q.trait] || 0) + 1;
    }
  });

  const traits = Object.keys(traitScores);

  // ✅ User already answers in 20–100 range — no need to transform
  const userVector = traits.map(trait => traitScores[trait] / traitCounts[trait]);

  allSimilarities = allCharacters.map(char => {
    // ✅ Transform character trait to 0–100
    const charVector = traits.map(trait => ((char[trait] || 0) - 50) * 2);

    const similarity = softJaccardSimilarity(userVector, charVector);

    return { ...char, similarity: similarity.toFixed(2) };
  });

  renderOverallBest();
  document.getElementById("retake-container").style.display = "block";
document.getElementById("createPdfBtn").addEventListener("click", generatePdf);

  localStorage.setItem("quizAnswers", JSON.stringify(userAnswers));
}
function imageExists(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}


// Load these scripts in index.html
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>

async function generatePdf() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
  const bg = await loadImageAsDataURL('./background.png');

  // Show progress UI
  const statusEl = document.getElementById("pdf-status");
  const msgEl = document.getElementById("pdf-message");
  statusEl.style.display = "block";
  msgEl.textContent = "Preparing your PDF...";

  const grouped = {};
  allSimilarities.forEach(char => {
    if (!grouped[char.Show]) grouped[char.Show] = [];
    grouped[char.Show].push(char);
  });

  // Sort each show's characters by similarity and keep top 5
  for (let show in grouped) {
    grouped[show].sort((a, b) => b.similarity - a.similarity);
    grouped[show] = grouped[show].slice(0, 5);
  }

  const shows = Object.entries(grouped);
  for (let i = 0; i < shows.length; i += 2) {
    const renderingShows = shows.slice(i, i + 2).map(([show]) => show).join(" & ");
    msgEl.textContent = `Rendering: ${renderingShows}`;

    const page = document.createElement('div');
    page.style.width = '800px';
    page.style.minHeight = '1123px';
    page.style.padding = '40px';
    page.style.backgroundImage = `url(${bg})`;
    page.style.backgroundSize = 'cover';
    page.style.color = '#fff';
    page.style.fontFamily = "'Bangers', cursive";
    page.style.boxSizing = 'border-box';
    page.style.lineHeight = '1.5';
    page.style.position = 'relative';

    const title = document.createElement('div');
    title.textContent = 'My Fictional Twin';
    title.style.color = '#ffe600';
    title.style.fontSize = '1.8rem';
    title.style.textAlign = 'center';
    title.style.textShadow = '1px 1px #000';
    title.style.backgroundColor = 'rgba(0,0,0,0.6)';
    title.style.border = '3px solid #ffb347';
    title.style.borderRadius = '12px';
    title.style.marginBottom = '20px';
    title.style.padding = '10px';
    page.appendChild(title);

    for (let j = 0; j < 2 && i + j < shows.length; j++) {
      const [show, chars] = shows[i + j];

      const sectionWrapper = document.createElement('div');
      sectionWrapper.style.background = 'rgba(0, 0, 0, 0.8)';
      sectionWrapper.style.border = '3px solid #ffb347';
      sectionWrapper.style.borderRadius = '12px';
      sectionWrapper.style.padding = '15px';
      sectionWrapper.style.margin = '20px 0';

      const header = document.createElement('h2');
      header.textContent = show;
      header.style.color = '#ffb347';
      header.style.fontSize = '1.4rem';
      header.style.textShadow = '1px 1px #000';
      header.style.marginBottom = '10px';
      sectionWrapper.appendChild(header);

      for (const char of chars) {
        const imageUrl = `./characters/${encodeURIComponent(char.Character).replace(/%20/g, ' ')}.png`;
        const imgExists = await imageExists(imageUrl);

        const div = document.createElement('div');
        div.style.background = 'rgba(255,255,255,0.1)';
        div.style.borderLeft = '5px solid #ffe600';
        div.style.padding = '8px';
        div.style.borderRadius = '8px';
        div.style.margin = '8px 0';
        div.style.color = '#fff';
        div.style.display = 'flex';
        div.style.alignItems = 'center';

        if (imgExists) {
          const wrapper = document.createElement('div');
          wrapper.style.width = '48px';
          wrapper.style.height = '48px';
          wrapper.style.borderRadius = '50%';
          wrapper.style.overflow = 'hidden';
          wrapper.style.marginRight = '10px';
          wrapper.style.border = '2px solid #ffe600';
          wrapper.style.display = 'flex';
          wrapper.style.alignItems = 'center';
          wrapper.style.justifyContent = 'center';

          const img = document.createElement('img');
          img.src = imageUrl;
          img.style.transform = 'scale(1.2)';
          img.style.width = '100%';
          img.style.height = 'auto';
          img.style.display = 'block';

          wrapper.appendChild(img);
          div.appendChild(wrapper);
        }

        const text = document.createElement('div');
        text.innerHTML = `<strong style="color:#ffe600; font-size:1.1rem;">${char.Character}</strong><br><span style="color:#fff; font-size:1rem;">${char.similarity}% match</span>`;
        div.appendChild(text);

        sectionWrapper.appendChild(div);
      }

      page.appendChild(sectionWrapper);
    }

    document.body.appendChild(page);
    await new Promise(r => requestAnimationFrame(r));
    const canvas = await html2canvas(page, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    document.body.removeChild(page);
  }

  msgEl.textContent = "Finalizing and saving your PDF...";
  pdf.save('MyFictionalTwin.pdf');
  statusEl.style.display = "none";
}

function loadImageAsDataURL(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);
      resolve(canvas.toDataURL());
    };
    img.onerror = reject;
    img.src = src;
  });
}

function imageExists(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

async function renderShowToPdf(pdf, characters, showName, yOffset) {
  const container = document.createElement("div");
  container.style.width = "800px";
  container.style.padding = "20px";
  container.style.fontFamily = "'Segoe UI', sans-serif";
  container.style.lineHeight = "1.6";
  container.style.background = "#ffffff";
  container.style.color = "#000";
  container.innerHTML = `<h2 style="color:#ff3860;">${showName}</h2>`;

  characters
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5)
    .forEach(char => {
      const div = document.createElement("div");
      div.style.margin = "8px 0";
      div.style.padding = "8px";
      div.style.borderLeft = "4px solid #ff3860";
      div.style.background = "#f9f9f9";
      div.style.borderRadius = "6px";
      div.innerHTML = `<strong>${char.Character}</strong> – ${char.similarity}% match`;
      container.appendChild(div);
    });

  document.body.appendChild(container);
  await new Promise(r => requestAnimationFrame(r));

  const canvas = await html2canvas(container, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth() - 80;
  const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, 'PNG', 40, yOffset, pdfWidth, imgHeight);
  document.body.removeChild(container);
}




function renderCharacterResult(char, container) {
  const div = document.createElement("div");
  div.className = "result-item";
  const imageUrl = `./characters/${encodeURIComponent(char.Character).replace(/%20/g, ' ')}.png`;
 // ensure .jpg or .png matches actual filenames
  const imageTag = `<img src="${imageUrl}" alt="${char.Character}" class="char-img" onerror="this.style.display='none';">`;


  div.innerHTML = `
  ${imageTag}
  <span class="char-name">${char.Character}&nbsp;</span>
  <span class="char-meta">from&nbsp;</span>
  <span class="char-show">${char.Show}</span>
  <span class="char-match">– ${char.similarity}% match</span>
`;


  container.appendChild(div);
}



function renderOverallBest() {
  const results = {};
  allSimilarities.forEach(char => {
    if (!results[char.Show] || parseFloat(results[char.Show].similarity) < char.similarity) {
      results[char.Show] = char;
    }
  });

  const sorted = Object.values(results).sort((a, b) => b.similarity - a.similarity);

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<h3>You’re most like:</h3>";

  sorted.forEach(char => {
    renderCharacterResult(char, resultsDiv);
  });
    document.getElementById("retake-container").style.display = "block";

  populateShowSuggestions();
}


function populateShowSuggestions() {
  const uniqueShows = [...new Set(allSimilarities.map(c => c.Show))].sort();
  const list = document.getElementById("showList");
  list.innerHTML = "";
  uniqueShows.forEach(show => {
    const option = document.createElement("option");
    option.value = show;
    list.appendChild(option);
  });
}



document.addEventListener("DOMContentLoaded", () => {
  if (DEBUG_RESULTS_ONLY) {
  // Simulate dummy answers for all 36 questions
  flatQuestions = [];
  Object.entries(questionBank).forEach(([trait, list]) => {
    const selected = list.slice(0, 2); // first 2 questions per trait
    selected.forEach(q => flatQuestions.push({ text: q, trait }));
  });

  userAnswers = new Array(flatQuestions.length).fill(80); // simulate all "Neutral"
  
  // Skip to results directly
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("search-controls").style.display = "block";

  if (allCharacters && allCharacters.length) {
    calculateResults();
  } else {
    // wait for characters to load
    fetch('Characterratings.json')
      .then(res => res.json())
      .then(data => {
        allCharacters = data;
        calculateResults();
      });
  }
}

  const searchInput = document.getElementById("searchInput");
  const resetBtn = document.getElementById("resetBtn");

  searchInput.addEventListener("input", function () {
    const val = this.value.trim().toLowerCase();
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (val === "") return renderOverallBest();

    const filtered = allSimilarities
      .filter(c => c.Show.toLowerCase() === val)
      .sort((a, b) => b.similarity - a.similarity);

    if (filtered.length === 0) {
      resultsDiv.innerHTML = `<p>No matches found for "${this.value}"</p>`;
    } else {
      filtered.forEach(char => {
  renderCharacterResult(char, resultsDiv);
});

    }
  });

  resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    renderOverallBest();
  });
});
