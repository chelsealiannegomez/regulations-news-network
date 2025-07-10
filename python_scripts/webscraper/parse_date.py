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

def parse_date_DMY(date):
    try:
        dateList = date.split(" ")
        
        day = int(dateList[0])
        month = months.index(dateList[1]) + 1
        year = int(dateList[2])

        return year, month, day
    except Exception as e:
        print("Error in parsing date:", e)