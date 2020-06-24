using UnityEngine;
using UnityEngine.SceneManagement;

public class Box : MonoBehaviour
{
private bool isClicked = false;

private void OnMouseDown()
{
if(!isClicked)
{
GetComponent<SpriteRenderer>().color = Color.red;
}
}
private void OnMouseUp()
{
if(!isClicked)
{
GetComponent<SpriteRenderer>().color = Color.white;
isClicked = true;
}
}
}