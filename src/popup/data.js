const data = [
  {
    url: /^chess\.com/,
    quotaRules: [
      {
        daysOfWeek: [0, 1, 2, 3],
        quotaTime: 30,
        timeOfDay: {
          startTime: '00:00',
          endTime: '23:59',
          quota: 27,
        },
      },
      {
        daysOfWeek: [2, 3, 4],
        quotaTime: 20,
        timeOfDay: {
          startTime: '00:00',
          endTime: '12:00',
          quota: 15,
        },
      },
    ],
  },
  {
    categoryId: '20', // gaming
    quota: 30, // daily limit in minutes
    quotaRules: [
      {
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        timeOfDay: [
          {
            startTime: '00:00',
            endTime: '23:59',
            quota: 10,
          },
        ],
      },
    ],
  },
]

export default data
