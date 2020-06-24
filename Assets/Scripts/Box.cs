using UnityEngine;
using UnityEngine.SceneManagement;


public class Box : MonoBehaviour
{
    

  

    private void OnMouseDown()  //built in method called when mouse is clicked (this case bird gets red)
    {
        GetComponent<SpriteRenderer>().color = Color.red; //GetComponent is built in method to 
                                                          //acces components inside unity
    }

    private void OnMouseUp() // //built in method called when mouse is unclicked (this case bird gets white)
    {
        GetComponent<SpriteRenderer>().color = Color.white;
    }

}