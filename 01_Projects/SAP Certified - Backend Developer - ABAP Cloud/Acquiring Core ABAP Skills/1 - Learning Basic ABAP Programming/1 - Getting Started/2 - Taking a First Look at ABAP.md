---
title: "Taking a First Look at ABAP"
source: "https://learning.sap.com/courses/basic-abap-programming/taking-a-first-look-at-abap_deb518e7-5030-48b9-9389-6507b48cf524"
author:
published:
created: 2026-10-16
description: "After completing this lesson, you will be able to:Work with a development object."
tags:
  - "clippings"
---


Upgrade to AI-powered learning

Get tailored answers, tune into podcasts, and dive deeper with interactive study guides, mind maps, FAQs and more.

Objective

After completing this lesson, you will be able to work with a development object.

## Investigation of ABAP Code

### Working in the Project Explorer

To work with ABAP development objects, you usually display the contents of a package in the project explorer. Packages are containers for development objects that logically belong together.

![](https://learning.sap.com/service/media/topic/c7231867-cf1f-4d30-91a1-b7b6bec8b8b8/S4D400_2601_en-US_media/S4D400_2601_en-US_images/02_Analyzing_ABAP_Coding_001.png)

To add a package to your favorites, right-click the *Favorite Packages* node in the project explorer and choose *Add Package*. A dialog box appears, in which you can enter a filter term. The system then displays only the packages that contain this term. Double-click the package that you want to add to your favorites.

### Opening Development Objects

There are two ways to open a development object in ADT.

![](https://learning.sap.com/service/media/topic/c7231867-cf1f-4d30-91a1-b7b6bec8b8b8/S4D400_2601_en-US_media/S4D400_2601_en-US_images/02_Analyzing_ABAP_Coding_002.png)

The first is to locate the object name in the project explorer and double-click it. The other is to use the keyboard shortcut, Ctrl + Shift + A. This opens a dialog box in which you can enter part of the name of an object.

### Investigating a Development Object

When you are working with ABAP code, there are certain function keys in ADT that will help you.

Let's look at these function keys.

![](https://learning.sap.com/service/media/topic/c7231867-cf1f-4d30-91a1-b7b6bec8b8b8/S4D400_2601_en-US_media/S4D400_2601_en-US_images/02_Analyzing_ABAP_Coding_003.png)

F1

The F1 key displays the ABAP language help for the current statement. A statement is the name for a command in ABAP.

F2

The F2 key displays information about the element on which the cursor is placed.

F3

The F3 key navigates to the definition of the object on which the cursor is placed. You can return from there to the original object using the key combination, ALT + LEFT ARROW, on your keyboard.

## Create an ABAP Cloud Project and Investigate ABAP Coding

In this exercise, you start your ABAP cloud project and analyze some existing ABAP code to get familiar with some basic features of the ABAP development environment.

### Prerequisites

If you want to do the exercises as described in this learning journey, you have to book the dedicated hands-on practice system. Follow this link for details: [https://learning.sap.com/practice-systems/basic-abap-programming](https://learning.sap.com/practice-systems/basic-abap-programming).

In addition to the **ABAP Service Instance URL**, which you will receive during the booking process, you need a local installation of the *Eclipse IDE* with the *ABAP Development Tools* plug-in installed on top. Follow this link for a step-by-step instruction [https://developers.sap.com/tutorials/abap-install-adt.html](https://developers.sap.com/tutorials/abap-install-adt.html).

### Task 1: Create an ABAP Cloud Project

Open Eclipse, switch to the ABAP perspective and create an ABAP Cloud Project.

#### Steps

1. Open Eclipse and switch to the ABAP perspective.
	1. Open Eclipse.
		2. Choose *Window* → *Perspective* → *Open Perspective* → *Other...*.
		3. In the dialog box, double-click *ABAP*.
2. Create an *ABAP Cloud Project*.
	1. Choose *File* → *New* → *ABAP Cloud Project*.
		2. Proceed as follows on the *New ABAP Cloud Project* dialog that appears:
		If you have been given the *ABAP Service Instance URL*:
		3. Copy and paste this URL in the corresponding field on the dialog.
		4. Choose *Next*.
		If you have been given a file containing the *Service Key*:
		5. Select the *Extract* link on the dialog.
		6. Choose *Import...* and select the file with the *Service Key*.
		7. After importing click *Copy to Clipboard* to copy the *Service Instance URL*.
		8. Choose *Close*.
		9. In the top of the popup box in the *ABAP Service Instance URL:\** field, paste the *ABAP Service Instance URL* with the key combination *Ctrl + V*.
		10. Choose *Next*.
		11. Choose *Open Logon Page in Browser*.
		12. You will be prompted to logon to the system.
		Enter the user and password that you used to register to SAP Learning Hub.
		13. When you see the message, *You have been successfully logged on*, close the browser window and return to Eclipse.
		14. To finish creating the project, choose *Finish*.

### Task 2: Analyze ABAP Class /DMO/CL\_FLIGHT\_LEGACY

Use some functions of the *ABAP Development Tools* to analyze the source code of ABAP class **/DMO/CL\_FLIGHT\_LEGACY**.

Note

You are not required to read the code in this exercise. Instead, concentrate on the navigation and display functions in the development environment.

#### Steps

1. Add the **/DMO/FLIGHT** package to your *Favorite Packages*.
	1. In the *Project Explorer* view, right-click on the *Favorite Packages* folder under your project folder.
		2. Choose *Add Package...* from the context menu.
		3. In the input field, enter **/DMO/FLIGHT** as search string.
		4. In the list of matching items, click on the */DMO/FLIGHT* entry and choose *OK*.
2. Open the ABAP class **/DMO/CL\_FLIGHT\_LEGACY** in the editor view.
	1. In the Eclipse menu, choose *Navigate* → *Open ABAP Development Object...* or press **Ctrl + Shift + A**.
		2. In the input field, enter **/DMO/CL\_FLIGHT** as search string.
		3. In the list of matching items, click on */DMO/CL\_FLIGHT\_LEGACY (Class)* and choose *OK*.
3. Open the *Properties* tab to display the administrative data of development object **/DMO/CL\_FLIGHT\_LEGACY**.
	1. Place the cursor anywhere in the source code of class **/DMO/CL\_FLIGHT\_LEGACY**.
		2. In the tab strip below the editor view, navigate to *Properties* tab.
		3. Analyze the administrative data that is displayed there, for example the original language or the timestamp of the last change.
4. Locate the ABAP class **/DMO/CL\_FLIGHT\_LEGACY** in the *Project Explorer* view on the left of the display.
	1. Place the cursor anywhere in the source code of the class **/DMO/CL\_FLIGHT\_LEGACY**.
		2. From the toolbar of the *Project Explorer*, choose *Link with Editor*. This should expand a part of the tree under your ABAP project with the ABAP class **/DMO/CL\_FLIGHT\_LEGACY** as its end point.
5. Find the string **get\_instance( )->get** in the source code of ABAP class **/DMO/CL\_FLIGHT\_LEGACY**.
	Note
	There has to be exactly one blank between the brackets.
	1. Place the cursor in the first row of the source code of class **/DMO/CL\_FLIGHT\_LEGACY**.
		2. Press **Ctrl + F** to open the *Find/Replace* dialog.
		3. In the *Find* input field that appears, enter **get\_instance( )->get**.
6. In the current code line, navigate to the implementation of code element get.
	1. Press the *Ctrl* key and click on *get*. From the appearing menu choose *Navigate to Implementation*. Alternatively, place the cursor in the word *get* and press **F3**.
7. A few code lines down there is a line starting with SELECT. Without navigating away, display some information about code element /dmo/travel after keyword FROM.
	1. In the code line starting with SELECT, place the cursor on /dmo/travel and press **F2**.
8. Display the ABAP Language Help for the keyword SELECT.
	1. At the beginning of the current code line, place the cursor on SELECT and press **F1**.
		Hint
		If the ABAP Language Help view that opens indicates that the result set of the search query is not supported in the current ABAP language version, enter **SELECT** in the *search term* field of the ABAP Language Help view and press *Enter*. This search should provide the desired help.
		Note
		There is no need to read or understand the documentation at this point.