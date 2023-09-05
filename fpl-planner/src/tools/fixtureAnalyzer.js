function fixtureAnalyzer(gameWeek, numberOfFixtures, fixturesArr) {
    const arrLength = fixturesArr.length;
    let totalFixtureDifficulty = 0;
    const currentFixture = fixturesArr.find(fixture => fixture.event === gameWeek);
    const arrStartIndex = fixturesArr.indexOf(currentFixture)
    if (numberOfFixtures > arrLength - arrStartIndex) {
        numberOfFixtures = arrLength - arrStartIndex;
    }

    for(let i = arrStartIndex; i <= numberOfFixtures + arrStartIndex; i++) {
        if(fixturesArr[i] === undefined) {
            return;
        }
        const fixtureDifficulty = fixturesArr[i].difficulty;
        totalFixtureDifficulty += fixtureDifficulty;
    } 
    const indexDifficulty = totalFixtureDifficulty/numberOfFixtures;
    return indexDifficulty;
  }

  export default fixtureAnalyzer;