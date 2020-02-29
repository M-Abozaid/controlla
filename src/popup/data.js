const data = [
  {
    url: /chess\.com/,
    quotaRules: [
      {
        daysOfweek: [0, 1, 2, 3],
        timeOfDay: [
          {
            startTime: '00:00',
            endTime: '23:59',
            quota: 30
          }
        ]
      },
      {
        daysOfweek: [2, 3, 4],
        timeOfDay: [
          {
            startTime: '00:00',
            endTime: '12:00',
            quota: 30
          },
          {
            startTime: '13:00',
            endTime: '20:00',
            quota: 30
          }
        ]
      }
    ]
  },
  {
    categoryId: '20', // gaming
    quota: 10, // daily limit in minutes
    quotaRules: [
      {
        daysOfweek: [0, 1, 2, 3, 4, 5, 6],
        timeOfDay: [
          {
            startTime: '00:00',
            endTime: '23:59',
            quota: 30
          }
        ]
      }
    ]
  }
]

export default data
