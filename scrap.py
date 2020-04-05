# #!/usr/bin/python3

# import requests
# from bs4 import BeautifulSoup

# url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSc_2y5N0I67wDU38DjDh35IZSIS30rQf7_NYZhtYYGU1jJYT6_kDx4YpF-qw0LSlGsBYP8pqM_a1Pd/pubhtml#"

# response = requests.get(url)
# document = BeautifulSoup(response.text, "html.parser")

# table_rows = document.findAll("tr")
# table_headers = table_rows[1].findAll("td")
# keys = list()
# for td in table_headers :
#     if td.text :
#         keys.append(td.text)

# # Data starts from 4th row of the table
# row = 3
# row_data = 

# print(keys, len(keys))

#!/usr/bin/python3

import re, urllib

class Spreadsheet(object):
    def __init__(self, key):
        super(Spreadsheet, self).__init__()
        self.key = key

class Client(object):
    def __init__(self, email, password):
        super(Client, self).__init__()
        self.email = email
        self.password = password

    def _get_auth_token(self, email, password, source, service):
        url = "https://www.google.com/accounts/ClientLogin"
        params = {
            "Email": email, "Passwd": password,
            "service": service,
            "accountType": "HOSTED_OR_GOOGLE",
            "source": source
        }
        req = urllib.request.urlopen(url, urllib.parse.urlencode(params))
        return re.findall(r"Auth=(.*)", urllib.request.urlopen(req).read())[0]

    def get_auth_token(self):
        source = type(self).__name__
        return self._get_auth_token(self.email, self.password, source, service="wise")

    def download(self, spreadsheet, gid=0, format="csv"):
        url_format = "https://spreadsheets.google.com/feeds/download/spreadsheets/Export?key=%s&exportFormat=%s&gid=%i"
        headers = {
            "Authorization": "GoogleLogin auth=" + self.get_auth_token(),
            "GData-Version": "3.0"
        }
        req = urllib.request(url_format % (spreadsheet.key, format, gid), headers=headers)
        return urllib.request.urlopen(req)

if __name__ == "__main__":
    import getpass
    import csv

    email = "reverse.web64bit@gmail.com" # (your email here)
    # password = getpass.getpass()
    password = "mailforctfs"
    spreadsheet_id = "" # (spreadsheet id here)

    # Create client and spreadsheet objects
    gs = Client(email, password)
    ss = Spreadsheet(spreadsheet_id)

    # Request a file-like object containing the spreadsheet's contents
    csv_file = gs.download(ss)

    # Parse as CSV and print the rows
    for row in csv.reader(csv_file):
        print(", ".join(row))