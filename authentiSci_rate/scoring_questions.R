div(class = 'container',
    div(class = 'col-sm-2'),
    div(class = 'col-sm-8',
        radioButtons("sources1", "1. Is the information supported by relevant and cited evidence?",
                     c("Yes" = "2",
                       "No" = "0",
                       "Not Applicable/Don't Know" = "1"), inline=TRUE,
                     selected = "1"),
        radioButtons("sources2", "2. Are the sources of information up-to-date?",
                     c("Yes" = "2",
                       "No" = "0",
                       "Not Applicable/Don't Know" = "1"), inline=TRUE,
                     selected = "1"),
        radioButtons("bias1", "3. Is there a conflict of interest?",
                     c("Yes" = "0",
                       "No" = "2",
                       "Not Applicable/Don't Know" = "1"), inline=TRUE,
                     selected = "1"),
        radioButtons("bias2", "4. Does the article address the limitations and areas of uncertainty?",
                     c("Yes" = "2",
                       "No" = "0",
                       "Not Applicable/Don't Know" = "1"), inline=TRUE,
                     selected = "1"),
        radioButtons("clarity1", "5. Is the scientific message clear and easy to understand?",
                     c("Yes" = "2",
                       "No" = "0",
                       "Not Applicable/Don't Know" = "1"), inline=TRUE,
                     selected = "1"),
        radioButtons("clarity2", "6. Do the article and headline accurately reflect the original findings?",
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