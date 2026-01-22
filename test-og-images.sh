#!/bin/bash

# Test OG Image API locally
# Run this script while dev server is running: npm run dev

BASE_URL="http://localhost:3000"

echo "Testing OG Image API..."
echo ""

# Test 1: Homepage
echo "1. Testing Homepage..."
open "${BASE_URL}/api/og"
sleep 2

# Test 2: About
echo "2. Testing About page..."
open "${BASE_URL}/api/og?title=About%20Us&subtitle=Where%20surf%20and%20science%20meet&type=about"
sleep 2

# Test 3: Contact
echo "3. Testing Contact page..."
open "${BASE_URL}/api/og?title=Get%20in%20Touch&subtitle=Let%27s%20Talk&type=contact"
sleep 2

# Test 4: Newsletter
echo "4. Testing Newsletter page..."
open "${BASE_URL}/api/og?title=Newsletter&subtitle=Stay%20updated%20with%20surf%20science&type=newsletter"
sleep 2

# Test 5: Issue Detail
echo "5. Testing Issue Detail..."
open "${BASE_URL}/api/og?title=Issue%200&subtitle=January%202026&type=issue&cover=/images/issues/issue-0/cover.png&accentColor=%230097B2&issueNumber=0"
sleep 2

# Test 6: Legal
echo "6. Testing Legal page..."
open "${BASE_URL}/api/og?title=Privacy%20Policy&subtitle=How%20we%20protect%20your%20data&type=legal"

echo ""
echo "All tests opened in browser!"
