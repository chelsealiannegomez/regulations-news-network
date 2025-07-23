months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]

months_v2 = [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May",
    "Jun.",
    "Jul.",
    "Aug.",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dec.",
]


def parse_date_DMY(date):
    try:
        dateList = date.split(" ")
        
        day = int(dateList[0])

        if dateList[1] not in months:
            month = months_v2.index(dateList[1]) + 1
        else: 
            month = months.index(dateList[1]) + 1
            
        year = int(dateList[2])

        return year, month, day
    except Exception as e:
        print("Error in parsing date:", e)
