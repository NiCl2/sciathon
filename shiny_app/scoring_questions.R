div(class = 'container',
    div(class = 'col-sm-2'),
    div(class = 'col-sm-8',
        radioButtons("evidence", "1. Is the information supported by relevant evidence?",
                     c("Yes" = "2",
                       "No" = "0",
                       "Not Applicable/Don't Know" = "1"), inline=TRUE,
                     selected = "1"),
        radioButtons("when", "2. Are the sources up-to-date?",
                     c("Yes" = "2",
                       "No" = "0",
                       "Not Applicable/Don't Know" = "1"), inline=TRUE,
                     selected = "1"),
        radioButtons("bias", "3. Is there a conflict of interest?",
                     c("Yes" = "0",
                       "No" = "2",
                       "Not Applicable/Don't Know" = "1"), inline=TRUE,
                     selected = "1"),
        radioButtons("clear", "4. Is the science clear and easy to understand?",
                     c("Yes" = "2",
                       "No" = "0",
                       "Not Applicable/Don't Know" = "1"), inline=TRUE,
                     selected = "1"),
        radioButtons("uncertainty", "5. Does the article refer to areas of uncertainty?",
                     c("Yes" = "2",
                       "No" = "0",
                       "Not Applicable/Don't Know" = "1"), inline=TRUE,
                     selected = "1"),
        br()
    )
)

# Is the information supported by relevant evidence?
#     Are the sources up-to-date?
#     Is there a conflict of interest?
#     Is the science clear and easy to understand?
#     Does the article refer to areas of uncertainty?